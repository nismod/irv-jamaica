import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import mapboxgl from 'mapbox-gl'

import PositionControl from './PositionControl'
import Tooltip from './Tooltip'
import FeatureSidebar from './FeatureSidebar'
import Help from './Help'
import FloodControl from './FloodControl'
import NetworkControl from './NetworkControl';
import { commas } from './helpers'

/**
 * Process feature for tooltip/detail display
 *
 * Calculate damages     and losses
 *      in   USD         or  USD/day
 *      from USD million or  USD million / year
 * and save to features as formatted strings
 *
 * @param {object} f
 * @returns modified f
 */
function processFeature(f) {
  if (!f || !f.properties) {
    return f
  }
  if (f.properties.EAD_min) {
    f.properties.EAD_min_usd = commas(
      (f.properties.EAD_min * 1e6).toFixed(0))
  }
  if (f.properties.EAD_max) {
    f.properties.EAD_max_usd = commas(
      (f.properties.EAD_max * 1e6).toFixed(0))
  }
  if (f.properties.EAEL) {
    f.properties.EAEL_daily_usd = commas(
      ((f.properties.EAEL / 365) * 1e6).toFixed(0))
  }
  return f
}

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: props.lng || 116.12,
      lat: props.lat || 7.89,
      zoom: props.zoom || 4,
      selectedFeature: undefined,
      scenario: 'baseline',
      floodtype: 'fluvial',
      floodlevel: {
        _1m2m: true,
        _2m3m: true,
        _3m4m: true,
        _4m999m: true
      },
      showHelp: false,
      duration: 30,
      growth_rate_percentage: 2.8
    }
    this.map = undefined;
    this.mapContainer = React.createRef();
    this.tooltipContainer = undefined

    this.onLayerVisChange = this.onLayerVisChange.bind(this)
    this.setScenario = this.setScenario.bind(this)
    this.setFloodType = this.setFloodType.bind(this)
    this.setFloodLevel = this.setFloodLevel.bind(this)
    this.setMap = this.setMap.bind(this)
    this.toggleHelp = this.toggleHelp.bind(this)
    this.updateBCR = this.updateBCR.bind(this)
    this.networkBaseLayerID = this.networkBaseLayerID.bind(this)
  }

  setScenario(scenario) {
    this.setState({
      scenario: scenario
    })
    this.setMap(scenario, this.state.floodtype, this.state.floodlevel)
  }

  setFloodType(floodtype) {
    this.setState({
      floodtype: floodtype
    })
    this.setMap(this.state.scenario, floodtype, this.state.floodlevel)
  }

  setFloodLevel(level, value) {
    let floodlevel = Object.assign({}, this.state.floodlevel);
    floodlevel[level] = value

    this.setState({
      floodlevel: floodlevel
    })

    this.setMap(this.state.scenario, this.state.floodtype, floodlevel)
  }

  setMap(scenario, floodtype, floodlevel) {

    var flood_layers = ['1m2m', '2m3m', '3m4m', '4m999m']
    var flood_layer_colors = {
      '4m999m': "#072f5f",
      '3m4m': "#1261a0",
      '2m3m': "#3895d3",
      '1m2m': "#58cced"
    }

    for (var i in flood_layers) {
      var mapLayer = this.map.getLayer('flood_' + flood_layers[i]);

      if(typeof mapLayer !== 'undefined') {
        this.map.removeLayer('flood_' + flood_layers[i]);
      }

      if (floodlevel['_' + flood_layers[i]]) {
        this.map.addLayer(
          {
            "id": "flood_" + flood_layers[i],
            "type": "fill",
            "source": "flood",
            "source-layer": scenario + '_' + floodtype + '_1in1000_' + flood_layers[i],
            "paint": {
              "fill-color": flood_layer_colors[flood_layers[i]]
            }
          },
          this.networkBaseLayerID()
        );
      }
    }
  }

  networkBaseLayerID() {
    // insert before (under) road/rail/bridges/air/water/labels
    let before_layer_id;

    switch (this.props.map_style) {
      case 'flood':
        before_layer_id = 'country_labels';
        break;
      case 'roads':
        before_layer_id = 'road_class_6';
        break;
      case 'energy_network':
          break;
      case 'adaptation':
        before_layer_id = 'road_class_6';
        break;
      case 'risk':
        //before_layer_id = 'bridges';
        break;
      case 'impact':
        //before_layer_id = 'bridges';
        break;
      case 'overview':
          before_layer_id = 'road_class_6';
          break;
      default:
        before_layer_id = 'country_labels';
    }
    return before_layer_id;
  }

  setTooltip(features) {
    ReactDOM.render(
      React.createElement(Tooltip, {features: features, map_style: this.props.map_style}),
      this.tooltipContainer
    );
  }

  updateBCR(data) {
    const { duration, growth_rate_percentage } = data;

    this.setState({
      duration: duration,
      growth_rate_percentage: growth_rate_percentage
    })
  }

  toggleHelp(e) {
    const helpTopic = e.target.dataset.helpTopic;
    this.setState({
      showHelp: !this.state.showHelp,
      helpTopic: helpTopic
    })
  }

  componentDidMount() {
    const { lng, lat, zoom } = this.state

    this.map = new mapboxgl.Map({
      container: this.mapContainer.current,
      style: `/styles/${this.props.map_style}/style.json`,
      center: [lng, lat],
      zoom: zoom,
      minZoom: 3,
      maxZoom: 16
    })

    var nav = new mapboxgl.NavigationControl();
    this.map.addControl(nav, 'top-right');

    var scale = new mapboxgl.ScaleControl({
        maxWidth: 80,
        unit: 'metric'
    });
    this.map.addControl(scale, 'bottom-left');

    this.map.on('move', () => {
      const { lng, lat } = this.map.getCenter()
      this.setState({
        lng: lng,
        lat: lat,
        zoom: this.map.getZoom()
      })
    })

    // Container to put React generated content in.
    this.tooltipContainer = document.createElement('div')

    const tooltip = new mapboxgl.Marker(
      this.tooltipContainer, {offset: [-150, 0]}  // offset to match width set in tooltip-body css
    ).setLngLat(
      [0,0]
    ).addTo(
      this.map
    )

    this.map.on('mousemove', (e) => {
      const features = this.map.queryRenderedFeatures(e.point);

      const clickableFeatures = features.filter(
        f => this.props.dataSources.includes(f.source)
      )

      const tooltipFeatures = features.filter(
        f => this.props.tooltipLayerSources.includes(f.source)
      )

      this.map.getCanvas().style.cursor = (
        clickableFeatures.length || tooltipFeatures.length
      )? 'pointer' : '';

      tooltip.setLngLat(e.lngLat);
      this.setTooltip(tooltipFeatures.map(processFeature));
    });

    this.map.on('click', (e) => {
      const features = this.map.queryRenderedFeatures(e.point);
      const clickableFeatures = features.filter(
        f => this.props.dataSources.includes(f.source)
      )

      const feature = (clickableFeatures.length)?
        clickableFeatures[0]
        : undefined;

      if (this.props.map_style === 'regions') {
        if (feature) {
          // pass region code up to App for RegionSummary to use
          this.props.onRegionSelect(feature.properties)
        } else {
          this.props.onRegionSelect(undefined)
        }
      } else {
        if (feature) {
          this.drawFeature(feature)
        } else {
          // remove current highlight
          if (this.map.getLayer('featureHighlight')) {
            this.map.removeLayer('featureHighlight');
            this.map.removeSource('featureHighlight');
          }
        }
        this.setState({
          selectedFeature: processFeature(feature)
        })
      }
    })
  }

  drawFeature(feature) {
    // remove current highlight
    if (this.map.getLayer('featureHighlight')) {
      this.map.removeLayer('featureHighlight');
      this.map.removeSource('featureHighlight');
    }

    // add highlight layer
    this.map.addSource('featureHighlight', {
      "type":"geojson",
      "data": feature.toJSON()
    });

    if (feature.layer.type === 'line') {
      this.map.addLayer({
        "id": "featureHighlight",
        "type": "line",
        "source": "featureHighlight",
        "layout": {
          "line-join": "round",
          "line-cap": "round"
        },
        "paint": {
          "line-color": "yellow",
          "line-width": {
            "base": 1,
            "stops": [[3, 1], [10, 8], [17, 16]]
          }
        }
      });
    }
    if (feature.layer.type === 'circle') {
      this.map.addLayer({
        "id": "featureHighlight",
        "type": "circle",
        "source": "featureHighlight",
        "paint": {
          "circle-color": "yellow",
          "circle-radius": {
            "base": 1,
            "stops": [[3, 4], [10, 12], [17, 20]]
          }
        }
      });
    }
  }

  componentDidUpdate(prev) {
    if (prev.map_style !== this.props.map_style) {
      fetch(`/styles/${this.props.map_style}/style.json`)
        .then(response => response.json())
        .then(data => {
          this.map.setStyle(data);
          const feature = this.state.selectedFeature;
          if (feature && this.props.dataSources.includes(feature.source)) {
            this.drawFeature(feature)
          }
        });
    }
  }

  onLayerVisChange(e) {
    const layer = e.target.dataset.layer
    if (e.target.checked) {
      this.map.setLayoutProperty(layer, 'visibility', 'visible')
    } else {
      this.map.setLayoutProperty(layer, 'visibility', 'none')
    }
  }

  render() {
    const { lng, lat, zoom, selectedFeature } = this.state
    const { map_style, dataLayers, tooltipLayerSources } = this.props

    return (
      <Fragment>
        <div className="custom-map-control top-left">
          <h3 className="h4">Select layers</h3>
          {
            (dataLayers.length)?
              <NetworkControl
                onLayerVisChange={this.onLayerVisChange}
                dataLayers={dataLayers}
              />
            : null
          }
          {
            (map_style === 'risk')?
              <div>
                <small>
                Feature size indicates maximum expected annual damages plus maximum expected annual
                losses for a 30-day disruption
                </small>
                <span className="dot line" style={{"height": "2px", "width": "24px"}}></span>&lt;1 million USD<br/>
                <span className="dot line" style={{"height": "4px", "width": "24px"}}></span>1-5 million USD<br/>
                <span className="dot line" style={{"height": "6px", "width": "24px"}}></span>5-10 million USD<br/>
                <span className="dot line" style={{"height": "8px", "width": "24px"}}></span>&gt;10 million USD<br/>
                <a href="#help" data-help-topic="vietnam" onClick={this.toggleHelp}>
                { (this.state.showHelp)? 'Hide info' : 'More info' }
                </a>
              </div>
              : null
          }
          {
            (map_style === 'roads')?
              <small>
                Road network data extracted from OpenStreetMap
              </small> : null
          }
          {
            (map_style === 'rail')?
              <small>
                Rail network data extracted from OpenStreetMap
              </small> : null
          }
          {
            (map_style === 'energy_network')?
              <small>
                Energy network data extracted from Gridfinder
              </small> : null
          }
          {
            (tooltipLayerSources.includes('flood'))?
              <Fragment>
                <FloodControl
                  setScenario={this.setScenario}
                  setFloodType={this.setFloodType}
                  setFloodLevel={this.setFloodLevel}
                  />
                <a href="#help" data-help-topic="flood" onClick={this.toggleHelp}>
                { (this.state.showHelp)? 'Hide info' : 'More info' }
                </a>
              </Fragment>
            : null
          }
        </div>

        {
          (this.state.showHelp)?
            <Help topic={this.state.helpTopic} />
            : <FeatureSidebar
                feature={selectedFeature}
                updateBCR={this.updateBCR}
                duration={this.state.duration}
                growth_rate_percentage={this.state.growth_rate_percentage}
                />
        }
        <PositionControl lat={lat} lng={lng} zoom={zoom} />
        <div ref={this.mapContainer} className="map" />
      </Fragment>
    );
  }
}

Map.propTypes = {
  map_style: PropTypes.string.isRequired,
  toggleableLayerIds: PropTypes.array,
  clickableLayerAttributes: PropTypes.object
}

export default Map

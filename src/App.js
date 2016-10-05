import React, {Component} from 'react';

import './App.scss';
import {observer} from 'mobx-react'
import {action, observable} from 'mobx'
import * as d3 from 'd3'
import {textwrap} from 'd3-textwrap'
import Faux from 'react-faux-dom'
import domtoimage from 'dom-to-image';


var SVGComponent = React.createClass({
    render: function() {
        return <svg {...this.props}>{this.props.children}</svg>;
    }
});

const Textblock = observer(React.createClass({

  mixins: [
    Faux.mixins.core,
    Faux.mixins.anim
  ],

  getInitialState () {
    return {
      chart: 'loading...'
    }
  },

  componentDidMount () {
  },

  render () {
    const faux = this.connectFauxDOM('div', 'block')
    let wrap = textwrap().bounds({height: 'auto', width: this.props.width});

    d3.select(faux)
      .attr('class', 'verttext')
      .append('text')
      .html(this.props.text)
      .call(wrap)

    let style = {left: this.props.x+'px',
                 top: this.props.y+'px'}
    return (
      <div className="textblock" style={style}>
        {this.state.block}
      </div>
    )
  }
}))
class AppStore {
  @observable left = 'people you like';
  @observable right = 'people you know';
  @observable middle = 'happiness';
  @action changeLeft = (event) => {
    this.left = event.target.value
  }
  @action changeMiddle = (event) => {
    this.middle = event.target.value
  }
  @action changeRight = (event) => {
    this.right = event.target.value
  }
}

const store = {
  app: new AppStore()
}


@observer
class App extends Component {
  imageify() {
    var node = document.getElementById('venn');

    domtoimage.toPng(node, {quality: 1.0, height: 320, width: 640})
        .then(function (dataUrl) {
            var img = new Image();
            img.src = dataUrl;
            document.body.appendChild(img);
        })
        .catch(function (error) {
            console.error('oops, something went wrong!', error);
        });
  }
  render() {
    const {app} = store;
    return (
      <div className="App">
        <div id="venn" className="venn">
          <Textblock x="20" y="0" width="120" text={app.left}/>
          <Textblock x="160" y="0" width="80" text={app.middle}/>
          <Textblock x="300" y="0" width="120" text={app.right}/>
          <SVGComponent height="320px" width="100%">
            <circle cx="180" cy="160" r="140" fill="pink" opacity=".4"
                stroke="crimson" />
            <circle cx="340" cy="160" r="140" fill="lightblue" opacity=".4"
                stroke="mediumorchid" />
          </SVGComponent>
        </div>

        <div className="container">
          <div className="notification">
            <label className="label">Left</label>
            <p className="control">
              <input className="input" type="text"
              onChange={app.changeLeft}
              placeholder="Label for left circle"></input>
            </p>
            <label className="label">Middle</label>
            <p className="control">
              <input className="input" type="text"
              onChange={app.changeMiddle}
              placeholder="Label for overlap"></input>
            </p>
            <label className="label">Right</label>
            <p className="control">
              <input className="input" type="text"
              onChange={app.changeRight}
              placeholder="Label for left circle"></input>
            </p>
          </div>
        </div>
        <button onClick={this.imageify}>imageify</button>
      </div>

    )
  }
}

export default App;

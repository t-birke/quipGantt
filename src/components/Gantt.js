/*global gantt*/
import React, { Component } from 'react';
import 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/skins/dhtmlxgantt_material.css';

let taskId = null;

export default class Gantt extends Component {
  componentDidMount() {
    gantt.config.api_date="%d.%m.%Y";
    gantt.init(this.ganttContainer);
    gantt.parse(this.props.data);
    gantt.attachEvent("onLinkDblClick", function(id,e){console.log("onLinkDblClick")});
    gantt.showLightbox = (id) => {
      let task = gantt.getTask(id);
      console.log("task > ", task);
      this.props.onShowLightbox(task);
    };
    this.props.setGantt(gantt);
  }

  render() {
    return (
        <div
            ref={(input) => { this.ganttContainer = input }}
            style={{width: '100%', height: '100%'}}
        ></div>
    );
  }
}




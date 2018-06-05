/*global gantt*/
import React, { Component } from 'react';
import 'dhtmlx-gantt';
//import 'dhtmlx-gantt/codebase/ext/dhtmlxgantt_auto_scheduling.js';
import 'dhtmlx-gantt/codebase/skins/dhtmlxgantt_material.css';

let taskId = null;

export default class Gantt extends Component {
  componentDidMount() {
    gantt.config.api_date="%d.%m.%Y";

    gantt.config.date_grid="%d.%m.%Y"

        var weekScaleTemplate = function(date){
          var dateToStr = gantt.date.date_to_str("%d %M");
          var endDate = gantt.date.add(gantt.date.add(date, 1, "week"), -1, "day");
          return dateToStr(date) + " - " + dateToStr(endDate);
        };

        gantt.config.scale_unit = "week";
        gantt.config.step = 1;
        gantt.templates.date_scale = weekScaleTemplate;
        gantt.config.subscales = [
          {unit:"day", step:1, date:"%D" }
        ];
        gantt.config.scale_height = 50;
                gantt.config.min_grid_column_width = 42;
                gantt.config.min_column_width = 42;

        gantt.config.row_height = 42;

// grid config
const mainGridConfig = {
    columns: [
      {name: "text", tree: true, width: 120, resize: true},
      {
        name: "owner", align: "center", width: 60, label: "Owner", template: function (task) {
          return "...";

        }
      },
      {name: "add", width: 44}
    ]
  };

  gantt.config.layout = {
    css: "gantt_container",
    rows: [
      {
        cols: [
          {view: "grid", group:"grids", config: mainGridConfig, scrollY: "scrollVer"},
          {resizer: true, width: 1, group:"vertical"},
          {view: "timeline", id: "timeline", scrollX: "scrollHor", scrollY: "scrollVer"},
          {view: "scrollbar", id: "scrollVer", group:"vertical"}
        ]
      },
      {view: "scrollbar", id: "scrollHor"}
    ]
  };

 //   gantt.config.auto_scheduling = true;



    //set special color for project
    gantt.templates.task_class = function(start_date, end_date, item) {
            if (item.type  == gantt.config.types.project) return "gantt_project";
        };

    gantt.init(this.ganttContainer);
    gantt.parse(this.props.data);
    gantt.eachTask(function(task){
    task.$open = true;
    });
    gantt.render();
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




// Copyright 2017 Quip
/* @flow */

import quip from "quip";
import React from "react";
import Gantt from './Gantt';
import Lightbox from './Lightbox';

import Styles from "./App.less";
import "./Gantt.css";

export default class App extends React.Component {
    static propTypes = {
        rootRecord: React.PropTypes.instanceOf(quip.apps.RootRecord).isRequired,
        tasks: React.PropTypes.instanceOf(quip.apps.RecordList).isRequired,
        links: React.PropTypes.instanceOf(quip.apps.RecordList).isRequired,
        color: React.PropTypes.string.isRequired
    };

    state = {
        showLightbox: false,
        task: null,
        gantt: null,
    }

    onShowLightbox = (task) => {
        this.setState(() => ({"task": task}));
        this.setState(() => ({"showLightbox": true}));
    }

    onHideLightbox = () => {
        this.setState({showLightbox: false});
    }

    setGantt = (gantt) => {
        this.setState(() => ({"gantt": gantt}));
    }

    render() {
        const {tasks, links, color} = this.props;
        console.log(this.state);
        const formattedTasks = tasks.getRecords().map( task => ({
                            id: task.get("id"),
                            parent: task.get("parent"),
                            progress: task.get("progress"),
                            text: task.get("text"),
                            type: task.get("type"),
                            start_date: task.get("start_date"),
                            end_date: task.get("end_date"),
                            duration: task.get("duration"),
                        }
                        ));
        const formattedLinks = links.getRecords().map( link => ({
            id: link.get("id"),
            source: link.get("source"),
            target: link.get("target"),
            type: link.get("type")
        }));
        console.log("formattedTasks",JSON.stringify(formattedTasks));
        const data = {data: formattedTasks, links: formattedLinks};
        //console.log("data",JSON.stringify(data));
        return (
        <div tabIndex="0" className={Styles.container}>
        { this.state.showLightbox && (
            <Lightbox
                onDismiss={this.onDialogDismiss}
                task={this.state.task}
                onHideLightbox={this.onHideLightbox}
                gantt={this.state.gantt}
                tasks={tasks}
                />
            )

        /*steps
                .getRecords()
                .map(step => <Step
                    color={color}
                    selected={selected === step.getId()}
                    key={step.getId()}
                    record={step}
                    onSelected={this.setSelected}
                    onDelete={this.deleteStep}/>)*/}
                    <div className="gantt-container" id="gantt-container">
                      <Gantt data={data}
                            onShowLightbox={this.onShowLightbox}
                            setGantt={this.setGantt}
                            />
                    </div>
        </div>
        );
    }
}

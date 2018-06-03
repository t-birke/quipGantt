import quip from "quip";
import React from "react";


class Lightbox extends React.Component {
    static propTypes = {
        children: React.PropTypes.element.isRequired,
        onDismiss: React.PropTypes.func,
    };
	  state = {
	    newTaskName: '',
	    newTaskStart: '',
	    newTaskEnd: '',
	  }
	  updateField = (text,field) => {
	    this.setState(() => ({[field] : text}));

	  }
    componentDidMount() {
        quip.apps.showBackdrop(this.props.onDismiss);
        quip.apps.addDetachedNode(this.refs["node"]);
        const task = this.props.task;
/*
        const start_date = task.start_date.getDate() + "." + ((task.start_date.getMonth()+1) < 10 ? "0" + (task.start_date.getMonth()+1) : task.start_date.getMonth()+1) + "." + task.start_date.getFullYear()
	      const end_date = task.end_date.getDate() + "." + ((task.end_date.getMonth()+1) < 10 ? "0" + (task.end_date.getMonth()+1) : task.end_date.getMonth()+1) + "." + task.end_date.getFullYear()
	      */
        const start_date = task.start_date.getFullYear() + "-" + ((task.start_date.getMonth()+1) < 10 ? "0" + (task.start_date.getMonth()+1) : task.start_date.getMonth()+1) + "-" + task.start_date.getDate()
	      const end_date = task.end_date.getFullYear() + "-" + ((task.end_date.getMonth()+1) < 10 ? "0" + (task.end_date.getMonth()+1) : task.end_date.getMonth()+1) + "-" + task.end_date.getDate()

        this.updateField(task.text,"newTaskName");
        this.updateField(start_date,"newTaskStart");
        this.updateField(end_date,"newTaskEnd");
    }

    componentWillUnmount() {
        quip.apps.dismissBackdrop();
        quip.apps.removeDetachedNode(this.refs["node"]);
    }

    render() {
    		const { onDismiss,task, onHideLightbox, gantt } = this.props;
        const dimensions = quip.apps.getCurrentDimensions();
        const style = {
            position: "absolute",
            width: dimensions.width,
            height: dimensions.height,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(64,128,255,0.1)",//quip.apps.ui.ColorMap.BLUE.VALUE_LIGHT,
            color: quip.apps.ui.ColorMap.BLUE.VALUE,
            zIndex: 301,
        };
        return (
        	<div ref="node" style={style}>
            <div>
            ID = {task.id}<br />
            <table>
              <tr>
                <td>
                  <label>Task Name</label>
                </td>
                <td>
                  <input id="new-task-name" type="text" value={this.state.newTaskName} onChange={(e) => {return this.updateField(e.target.value,"newTaskName")}} /><br />
                </td>
              </tr>
              <tr>
                <td>
                  <label>Start Date</label>
                </td>
                <td>
                  <input id="new-task-start" type="text" value={this.state.newTaskStart} onChange={(e) => {return this.updateField(e.target.value,"newTaskStart")}}></input><br />
                </td>
              </tr>
              <tr>
                <td>
                  <label>End Date</label>
                </td>
                <td>
                  <input id="new-task-end" type="text" value={this.state.newTaskEnd} onChange={(e) => {return this.updateField(e.target.value,"newTaskEnd")}}></input><br />
                </td>
              </tr>
            </table>
            <button onClick={onHideLightbox} >Hide Lightbox</button>
            <button onClick={() => {
            	let newTask = gantt.getTask(task.id)
            	newTask.text = this.state.newTaskName;
            	newTask.start_date = new Date(this.state.newTaskStart);
            	newTask.end_date = new Date(this.state.newTaskEnd);
            	gantt.updateTask(task.id);
            	gantt.render();
            	onHideLightbox();
            }} >save</button>
          </div>
        </div>
        );
    }
}

export default Lightbox
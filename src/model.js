// Copyright 2017 Quip
/* @flow */

import quip from "quip";

class RootRecord extends quip.apps.RootRecord {
    static CONSTRUCTOR_KEY = "Root";

    static getProperties = () => ({
        tasks: quip.apps.RecordList.Type(TaskRecord),
        links: quip.apps.RecordList.Type(LinkRecord),
        selected: "string",
        color: "string",
    });

    static getDefaultProperties = () => ({
        tasks: [],
        links: [],
        selected: "",
        color: quip.apps.ui.ColorMap.VIOLET.KEY,
    });

    seed() {
        const defaultValues = this.constructor.getDefaultProperties();

        // These have to be seeded too since the connect function relies
        // on these being set on the record for first render
        Object.keys(defaultValues).forEach((key, i) => {
            this.set(key, defaultValues[key]);
        });
        this.get("tasks").add({id: 'parent', parent: null, text: 'Project 1', type: 'project', start_date: null, end_date: null, duration: null, progress: 0.3});
        [...Array(5)].map((_, i) => {
            let task = this.get("tasks").add({id: 'id-'+i, parent: 'parent', text: 'Task #' + i, type: 'task', start_date: (15+(i*2))+'.04.2017', end_date: null, duration: 2, progress: 0.6});
            i < 4 && (this.get("links").add({id: 'link-'+i, source: 'id-'+i, target: 'id-'+(i+1), type: '0'}));
        });
        this.set("selected", "id-0");

    }
}

class TaskRecord extends quip.apps.Record {
    static CONSTRUCTOR_KEY = "Task";

    static getProperties = () => ({
        id: "string",
        parent: "string",
        progress: "number",
        text: "string",
        type: "string",
        start_date: "string",
        end_date: "string",
        duration: "number",

    })

    supportsComments() {
        return true;
    }

    notifyParent() {
        const parent = this.getParentRecord();

        if (parent) {
            const listener = this.listen(() => parent.notifyListeners());
            this._unlistenParent = () => this.unlisten(listener);
            const commentListener = this.listenToComments(() =>
                parent.notifyListeners()
            );
            this._unlistenComments = () =>
                this.unlistenToComments(commentListener);
        }
    }

    delete() {
        if (typeof this._unlistenParent === "function") {
            this._unlistenParent();
        }
        if (typeof this._unlistenComments === "function") {
            this._unlistenComments();
        }
        super.delete();
    }
}

class LinkRecord extends quip.apps.Record {
    static CONSTRUCTOR_KEY = "Link";

    static getProperties = () => ({
        id: "string",
        source: "string",
        target: "string",
        type: "string"
    })

}

export default () => {
    const classes = [RootRecord, TaskRecord, LinkRecord];
    classes.forEach(c => quip.apps.registerClass(c, c.CONSTRUCTOR_KEY));
};

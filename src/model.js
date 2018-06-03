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
        [...Array(2)].map((_, i) => {
            let task = this.get("tasks").add({id: 'id-'+i, parent: null, text: 'Task #' + i, start_date: '15.04.2017', end_date: null, duration: 3, progress: 0.6});
        });
        this.set("selected", "id-0");
        this.get("links").add({id: 'link-1', source: 'id-0', target: 'id-1', type: '0'});
    }
}

class TaskRecord extends quip.apps.Record {
    static CONSTRUCTOR_KEY = "Task";

    static getProperties = () => ({
        id: "string",
        parent: "string",
        progress: "number",
        text: "string",
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

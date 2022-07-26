export default {
    view: (vnode) => {
        return m("div", { class: "form-container" }, [
            m("form", { class: "form-elements-container", }, [
                m("label", { class: "form-element-label", for: "text" }, "First name")
                // m("input", { class: "form-element-input", "type": vnode.attrs.type, id: vnode.attrs.id })
            ])
        ]);
    }
}; 

// ctrl + .
enyo.kind({
    name: "ProxySwitch",
    kind: enyo.VFlexBox,
    layoutKind: "VFlexLayout",
    style: "width: 100%;",
    align: "center",
    components: [{
            kind: "Header",
            style: "width: 100%; font-weight: bold;",
            align: "center",
            halign: "center",
            content: "ProxySwitch"
        },

        {
            kind: "RowGroup",
            caption: "Proxy Settings",
            style: "width: 350px; margin-top: 5px;",
            align: "center",
            components: [{
                    kind: "HFlexBox",
                    align: "center",
                    components: [{
                            content: "Proxy URL:",
                            flex: 2
                        },
                        {
                            name: "proxyURL",
                            kind: "Input",
                            flex: 3,
                            value: "127.0.0.1",
                            onchange: "setPrefs"
                        }
                    ]
                },
                {
                    kind: "HFlexBox",
                    align: "center",
                    components: [{
                            content: "Proxy Port:",
                            flex: 2
                        },
                        {
                            name: "proxyPort",
                            kind: "Input",
                            flex: 3,
                            value: "3128",
                            onchange: "setPrefs"
                        }
                    ]
                }
            ]
        },
        {
            kind: "Button",
            style: "width: 350px;",
            align: "center",
            caption: "Turn Proxy On",
            onclick: "btnAddClick"
        },
        {
            kind: "Button",
            style: "width: 350px;",
            align: "center",
            caption: "Turn Proxy Off",
            onclick: "btnRmvClick"
        },

        {
            name: "ReturnValue",
            kind: "Control",
            content: "",
            style: "width: 350px; text-align: center; padding: 5px; margin-top: 5px; border-radius: 7px; font-weight: bold;"
        },

        {
            name: "addProxy",
            kind: "PalmService",
            service: "palm://com.palm.connectionmanager/",
            method: "configureNwProxies",
            onSuccess: "proxyAddSuccess",
            onFailure: "genericFailure"
        },
        {
            name: "rmvProxy",
            kind: "PalmService",
            service: "palm://com.palm.connectionmanager/",
            method: "configureNwProxies",
            onSuccess: "proxyRmvSuccess",
            onFailure: "genericFailure"
        },
        {
            name: "getPreferencesCall",
            kind: "PalmService",
            service: "palm://com.palm.systemservice/",
            method: "getPreferences",
            onSuccess: "getPreferencesSuccess"
        },
        {
            name: "setPreferencesCall",
            kind: "PalmService",
            service: "palm://com.palm.systemservice/",
            method: "setPreferences"
        }
    ],

    create: function() {
        this.inherited(arguments);
        this.$.getPreferencesCall.call({
            "keys": ["defaultProxy", "defaultPort"]
        });
        // keep this updated with the value that's currently saved to the service
        this.savedProxy = "";
        this.savedPort = "";
    },

    btnAddClick: function() {
        this.$.addProxy.call({
            "action": "add",
            "proxyInfo": {
                "proxyConfigType": "manualProxy",
                "proxyScope": "default",
                "proxyServer": this.$.proxyURL.getValue(),
                "proxyPort": parseInt(this.$.proxyPort.getValue())
            }
        });
        this.$.ReturnValue.setContent("Turning Proxy on...");
        this.$.ReturnValue.applyStyle("background-color", "yellow");
    },

    btnRmvClick: function() {
        this.$.rmvProxy.call({
            "action": "rmv",
            "proxyInfo": {
                "proxyScope": "default"
            }
        });
        this.$.ReturnValue.setContent("Turning Proxy off...");
        this.$.ReturnValue.applyStyle("background-color", "yellow");
    },

    proxyAddSuccess: function(inSender, inResponse) {
        this.$.ReturnValue.setContent("Proxy is on");
        this.$.ReturnValue.applyStyle("background-color", "green");
    },

    proxyRmvSuccess: function(inSender, inResponse) {
        this.$.ReturnValue.setContent("Proxy is off");
        this.$.ReturnValue.applyStyle("background-color", "red");
    },

    genericFailure: function(inSender, inResponse) {
        this.$.ReturnValue.setContent(enyo.json.stringify(inResponse));
        this.$.ReturnValue.applyStyle("background-color", "yellow");
    },

    setPrefs: function() {
        this.$.setPreferencesCall.call({
            "defaultProxy": this.$.proxyURL.getValue(),
            "defaultPort": this.$.proxyPort.getValue()
        });
    },

    getPreferencesSuccess: function(inSender, inResponse) {
        if (inResponse.defaultProxy) {
            this.$.proxyURL.setValue(inResponse.defaultProxy);
        }
        if (inResponse.defaultPort) {
            this.$.proxyPort.setValue(inResponse.defaultPort);
        }
    }
});

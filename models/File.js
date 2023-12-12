const mongoose = require('mongoose');

const Types = mongoose.Schema.Types

const schema = new mongoose.Schema(
    {
        path: { type: Types.String, required: true,  },
        mimeType: { type: Types.String, required: true,  },
        storage: { type: Types.String, required: true, default: 'local'  },
        accessKeys: {
            public: {type: Types.String, required: true},
            private: {type: Types.String, required: true}
        },
        status: { type: Types.String, required: true, default: 'active'  },
        downloadCount: {type: Types.Number, required: true, default: 0}
    },
    { timestamps: true }
);

const File = mongoose.model("File", schema);

module.exports = File

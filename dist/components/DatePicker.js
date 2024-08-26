"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const moment_1 = __importDefault(require("moment"));
const DatePicker = ({ onDateChange }) => {
    const [startDate, setStartDate] = (0, react_1.useState)('');
    const [endDate, setEndDate] = (0, react_1.useState)('');
    const handleDateChange = () => {
        const frmt = 'YYYY-MM-DD';
        const formattedStartDate = (0, moment_1.default)(startDate).format(frmt);
        const formattedEndDate = (0, moment_1.default)(endDate).format(frmt);
        onDateChange(formattedStartDate, formattedEndDate);
    };
    return (react_1.default.createElement("div", { style: { marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#f0f0f0', gap: '10px' } },
        react_1.default.createElement("input", { type: "date", value: startDate, onChange: (e) => setStartDate(e.target.value), style: { marginRight: '10px' } }),
        react_1.default.createElement("input", { type: "date", value: endDate, onChange: (e) => setEndDate(e.target.value), style: { marginRight: '10px' } }),
        react_1.default.createElement("button", { onClick: handleDateChange, style: { padding: '5px 10px', } }, "\u0412\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u0438 \u043F\u0435\u0440\u0456\u043E\u0434")));
};
exports.default = DatePicker;

import React from 'react'
import { extractKey, extractValue } from '../../common/MapFunctionUtil';

export default class DualListBox extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectList: [],
            selectedList: [],
            keyName:"group_id",
            valueName:"group_name"
        }

        this.genKey = Math.round(Math.random() * 10000);
        this.selectListId = "select-list-box" + this.genKey;
        this.selectedListId = "selected-list-box" + this.genKey;
    }

    static getDerivedStateFromProps(props, state) {
        if (props.selectList !== state.selectList) {
            return {
                selectList: props.selectList || [],
                selectedList: props.selectedList || [],
                keyName:props.keyName,
                valueName:props.valueName
            };
        }
        return state;
    }

    returningSelectedItems = () => {
        this.props.getSelectedItemList($("#" + this.selectedListId + " option"));
    }

    _onSelect = () => {
        let selectedItems = "";
        let selectKey = this.selectListId;
        $("#" + this.selectListId + " option:selected").each(function (i, obj) {
            selectedItems += "<option value='" + obj.value + "'>" + obj.text + "</option>";
            $("#" + selectKey + " option[value='" + obj.value + "']").remove();
        });
        $("#" + this.selectedListId).append(selectedItems);
        this.returningSelectedItems();
    }

    _deSelect = () => {
        let selectedItems = "";
        let selectedKey = this.selectedListId;
        $("#" + this.selectedListId + " option:selected").each(function (i, obj) {
            selectedItems += "<option value='" + obj.value + "'>" + obj.text + "</option>";
            $("#" + selectedKey + " option[value='" + obj.value + "']").remove();
        });
        $("#" + this.selectListId).append(selectedItems);
        this.returningSelectedItems();
    }

    render() {
        let selectedMap = new Map();
        let key_name = this.state.keyName;
        let val_name = this.state.valueName;

        this.state.selectedList.filter((obj) => {
            selectedMap.set(obj[this.state.keyName], obj[this.state.valueName]);
        });

        return (
            <div className="smart-form">
                <section className="col col-5 form-inline">
                    <label className="label">전체</label>
                    <label className="select select-multiple" >
                        <select id={this.selectListId} multiple className="custom-scroll">
                            {this.state.selectList && this.state.selectList.length > 0 && this.state.selectList.map((item) => {
                                if(!selectedMap.has(item[key_name]) && item[key_name] !== null){
                                    const key = extractKey(item[key_name])
                                    const value = extractValue(item[key_name])
                                    return <option key={key} value={key}>{value + " ------- " +item[val_name]}</option>
                                }
                            })}
                        </select>
                    </label>
                </section>
                <section className="col col-2 dual-list-btn-group">
                    <button type="button" className="btn move btn-default daul-list-btn" onClick={() => { this._onSelect() }} style={{width:"64px"}}>
                        <i className="glyphicon glyphicon-arrow-right"></i>
                    </button><br />
                    <button type="button" className="btn move btn-default daul-list-btn" onClick={() => { this._deSelect() }} style={{width:"64px"}}>
                        <i className="glyphicon glyphicon-arrow-left"></i>
                    </button>
                </section>
                <section className="col col-5 form-inline">
                    <label className="label">선택</label>
                    <label className="select select-multiple" >
                        <select id={this.selectedListId} multiple className="custom-scroll">
                            {this.state.selectedList && this.state.selectedList.length > 0 && this.state.selectedList.map((item) => {
                                return <option key={item[key_name]} value={item[key_name]}>{item[val_name]}</option>
                            })}
                        </select>
                    </label>
                </section>
            </div>
        )
    }
}

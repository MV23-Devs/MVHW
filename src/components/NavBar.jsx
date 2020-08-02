import React, { Component } from 'react'

export default class NavBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listqs: []
        }
    }

    updateFilter = () => {
        console.log(this.state.listqs)
        this.props.updateFilter(this.state.listqs)
    }

    handleSearch = (e) => {
        let value = e.target.value
        if (value === "") {
            let arr = this.props.questions;
            this.setState({ listqs: arr });
            console.log(arr, this.state.listqs)
        } else {
            this.setState({ listqs: [] })
            this.setState({ listqs: this.props.questions.filter(item => item.getText().toLowerCase().includes(value.toLowerCase())) })
        }
        this.updateFilter();
    }

    render() {
        return (
            <React.Fragment>
                
            </React.Fragment>
        )
    }
}
import React, {Component} from 'react'

export default class NavBar extends Component{

    state = {
        filteredQuestions: []
    }

    updateFilter = (filteredQuestions) => {
        this.props.updateFilter(filteredQuestions)
    }

    handleSearch = (e) => {
        console.log(this.props)
        let value = e.target.value
        if(value === ""){
            this.setState({filteredQuestions: this.props.questions})
        }else{
            this.setState({filteredQuestions: this.props.questions.filter(item => item.getText().toLowerCase().includes(value.toLowerCase()))})
        }
        this.updateFilter(this.state.filteredQuestions)
    }

    render(){
        return (
            <React.Fragment>
                <input type="search" name="Search" id="searchBar" placeholder="Search" onChange={this.handleSearch}/>
            </React.Fragment>
        )
    }
}
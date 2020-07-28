import React, {Component} from 'react'

export default class NavBar extends Component{

    state = {
        questions: this.props.questions,
        filteredQuestions: []
    }

    updateFilter = (filteredQuestions) => {
        this.props.updateFilter(filteredQuestions)
    }

    handleSearch = (e) => {
        let value = e.target.value
        if(value === ""){
            this.setState({filteredQuestions: this.state.questions})
        }else{
            this.setState({filteredQuestions: this.state.questions.filter(item => item.getText().toLowerCase().includes(value.toLowerCase()))})
    
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
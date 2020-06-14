import React, { Component } from 'react';
import Plot from 'react-plotly.js';
import { debounce } from 'lodash';

// StockChart component will recieve a ticker from the SearchBar component
// Make an API request to pull the ending StockPrice over the last 100 days
// Then Chart the graph using Plotly.JS

class StockChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stockXValues: [],
            stockYValues: [],
            stockSymbol: '',
        }
        this.fetchStockDeb = debounce(this.fetchStock, 2000)
    }

    componentDidMount() {
        this.fetchStock();
    }

    
    componentDidUpdate() {
        if (this.state.stockSymbol !== this.props.stockSymbol) {
            this.fetchStock();
        }
    }


    fetchStock() {
        const pointer = this;
        let symbol = this.props.stockSymbol;
        const API_KEY = `BL5JNUPVNMKFM25Z`;
        let API_Call = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&outputsize=compact&apikey=${API_KEY}`;
        
        let StockXValuesFunc = [];
        let StockYValuesFunc = [];



        fetch(API_Call)
            .then(
                function(response) {
                    return response.json();
                }
            )
            .then(
                function(data) {
                    console.log(data);
                    
                    for (var key in data['Time Series (Daily)']) {
                        StockXValuesFunc.push(key);
                        StockYValuesFunc.push(data['Time Series (Daily)']
                        [key]['4. close']);
                    }
                    pointer.setState({
                        stockXValues: StockXValuesFunc,
                        stockYValues: StockYValuesFunc,
                        stockSymbol: symbol
                    });
                }
            )
            .catch((error) => {
                console.log(error);
            })
    }


    render() {

        return (
            <div>
                <Plot
                    data={[
                    {
                        x: this.state.stockXValues,
                        y: this.state.stockYValues,
                        type: 'scatter',
                        mode: 'lines+markers',
                        marker: {color: 'red'},
                    },
                    ]}
                    layout={ {width: 720, height: 440, title: 'Closing Price over the last 100 days'} }
                />
            </div>
          )

        // if(this.state.stockXValues > 0 && this.state.stockYValues > 0) {
        //     return (
        //         <div>
        //             <Plot
        //                 data={[
        //                 {
        //                     x: this.state.stockXValues,
        //                     y: this.state.stockYValues,
        //                     type: 'scatter',
        //                     mode: 'lines+markers',
        //                     marker: {color: 'red'},
        //                 },
        //                 ]}
        //                 layout={ {width: 720, height: 440, title: 'Closing Price over the last 100 days'} }
        //             />
        //         </div>
        //       )
        // } else {
        //     return <h1>
        //     Sorry, looks like the data for the ticker you searched isn't available. Please search for another ticker!
        // </h1>
        // }
  }
}


export default StockChart;
import React from 'react'
import './proxy.scss'

import * as jsPDF from 'jspdf'

class Proxy extends React.Component {
    constructor(props) {
        super(props);
        this.imageRef = React.createRef()
      }

    state = {
        fileDataURL: this.props.data.fileDataURL,
        nrOfCopies: this.props.data.nrOfCopies
    }

    onRemoveProxy = () => {
        this.props.onRemoveProxy(this.props.id)
    }

    onNrOfCopiesChange = (e) => {
        this.setState({
            nrOfCopies: parseInt(e.target.value)
        }, () => {
            this.props.onUpdateData(this.props.id, this.state)
        })
    }

    openFile = (file) => {
        let input = file.target;
        let reader = new FileReader();

        reader.onload = () => {
            let dataURL = reader.result;

            let img = this.imageRef.current
            img.onload = () => {
                this.setState({
                    fileDataURL: dataURL
                }, () => {
                    this.props.onUpdateData(this.props.id, this.state)
                })   
                
            }
            img.src = dataURL  
        }
        reader.readAsDataURL(input.files[0]);
    }

    render = () => {
        return (
            <div className="mtg-proxy">
                <div className="mtg-proxy-preview">
                    <img className="mtg-proxy-img" ref={this.imageRef}></img>
                </div>
                <div className="mtg-proxy-menu">
                    <div className="mtg-proxy-menu-row">    
                        <input type="file" id="file-input" onChange={this.openFile}/>
                    </div>
                    <div className="mtg-proxy-menu-row"> 
                        <span className="mtg-proxy-menu-label">Nr. of copies:</span>
                        <input type="number" value={this.state.nrOfCopies} min={1} onChange={this.onNrOfCopiesChange}/>
                    </div>
                    <div className="mtg-proxy-menu-row">    
                        <button onClick={this.onRemoveProxy}>Remove Card</button>
                    </div>                    
                </div>
            </div>
        )
    }
}

export default class ProxyList extends React.Component {

    state = {
        data: {
            1: {
                fileDataURL: '',
                nrOfCopies: 1
            }
        }
    }

    onUpdateData = (key, value) => {
        let tmp = {...this.state.data}
        tmp[key] = value
        this.setState({data: tmp})
    }

    addProxyCard = () => {
        let tmp = {...this.state.data}
        let newKey = Math.floor(Math.random() * 10000000)
        tmp[newKey] = {
            fileDataURL: '',
            nrOfCopies: 1
        }
        this.setState({data: tmp})
    }

    removeProxyCard = (key) => {
        let tmp = {...this.state.data}
        delete tmp[key]

        // if empty, add default
        if (Object.keys(tmp).length === 0) {
            tmp = {
                1: {
                    fileDataURL: '',
                    nrOfCopies: 1
                }
            }
        }
        this.setState({data: tmp})
    }

    preparePDF = () => {
        let pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        })
      
        let index = 0
        let page = 0
        let row = 0 // Math.floor(index / 3) 
        let col = 0 //index % 3

        for (const key in this.state.data) {
            const element = this.state.data[key]

            for(let i=0;i<element.nrOfCopies;i++){
                row = Math.floor(index / 3) 
                col = index % 3
                index++

                if (row > 2) {                    
                    pdf.addPage()
                    page++
                    index = 0
                    row = Math.floor(index / 3) 
                    col = index % 3
                }

                pdf.addImage(element.fileDataURL, 'PNG',
                    10 + (col * (63 + 2)),
                    10 + (row * (88 + 2)),
                    63,
                    88
                )
            }
        }
      
          pdf.save('mtg-proxies.pdf')
    }

    render = () => {

        let proxies = []
        for (const key in this.state.data) {
            const data = this.state.data[key];
            proxies.push(<Proxy data={data} id={key} 
                                onUpdateData={this.onUpdateData} 
                                onRemoveProxy={this.removeProxyCard} 
                                key={key}/>)
        }
       

        return (
            <div className="mtg-proxy-list">
                <div className="mtg-proxy-list-container">
                    {proxies}
                </div>
                <div className="mtg-proxy-list-menu">
                    <button className="mtg-btn-add-card mtg-btn" onClick={this.addProxyCard}>+ Add Proxy Card</button>
                    <button className="mtg-btn-save-pdf mtg-btn" onClick={this.preparePDF}>Save as PDF...</button>
                </div>
                
            </div>
        )
    }
}
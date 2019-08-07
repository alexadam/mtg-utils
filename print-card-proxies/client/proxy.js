import React from 'react'
import './proxy.scss'

import * as jsPDF from 'jspdf'

class Proxy extends React.Component {
    constructor(props) {
        super(props);
        this.imageRef = React.createRef()
        this.openFileRef = React.createRef()
        this.nrOfCopiesRef = React.createRef()
    }

    state = {
        id: this.props.data.id,
        fileDataURL: this.props.data.fileDataURL,
        nrOfCopies: this.props.data.nrOfCopies
    }

    componentDidMount = () => {
        console.log('STATE', this.state);
        
        if (!this.props.data.defaultProxy) {
            this.openFileRef.current.click()
        }
    }

    onRemoveProxy = () => {
        this.props.onRemoveProxy(this.props.index)
    }

    onAddProxy = () => {
        this.props.onAddProxy(this.props.index)
    }

    onNrOfCopiesChange = (e) => {
        this.setState({
            nrOfCopies: parseInt(e.target.value)
        }, () => {
            this.props.onUpdateData(this.props.index, this.state)
        })
    }

    onNrOfCopiesClick = () => {
        this.nrOfCopiesRef.current.select()
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
                    this.props.onUpdateData(this.props.index, this.state)
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
                        <input type="file" className="mtg-proxy-file-input" ref={this.openFileRef} onChange={this.openFile}/>
                    </div>
                    <div className="mtg-proxy-menu-row"> 
                        <span className="mtg-proxy-menu-label">Nr. of copies:</span>
                        <input type="number" value={this.state.nrOfCopies} min={1} 
                                onChange={this.onNrOfCopiesChange} 
                                ref={this.nrOfCopiesRef}
                                onClick={this.onNrOfCopiesClick}/>
                    </div>
                    <div className="mtg-proxy-menu-row">    
                        <button onClick={this.onRemoveProxy}>Remove Card</button>
                    </div>                    
                    <div className="mtg-proxy-menu-row">    
                        <button onClick={this.onAddProxy}>Add Card</button>
                    </div>                    
                </div>
            </div>
        )
    }
}

export default class ProxyList extends React.Component {

    indexKey = 1

    defaultdData = [{
        id: 1,
        fileDataURL: '',
        nrOfCopies: 1,
        defaultProxy: true
    }]

    state = {
        data: this.defaultdData
    }

    onUpdateData = (atIndex, value) => {
        let tmpArray = [...this.state.data]
        tmpArray.splice(atIndex, 1, value)
        this.setState({data: tmpArray})
    }

    addProxyCard = (afterIndex) => {        
        let tmpArray = [...this.state.data]
        let tmpData = {
            id: Math.floor(Math.random() * 100000000 * Math.random() * 100000000),
            fileDataURL: '',
            nrOfCopies: 1
        }
        if (!afterIndex) {
            tmpArray.push(tmpData)
        } else {
            tmpArray.splice(afterIndex + 1, 0, tmpData)        
        }
        this.setState({data: tmpArray})
    }

    removeProxyCard = (atIndex) => {
        let tmpArray = [...this.state.data]
        tmpArray.splice(atIndex, 1)

        // if empty, add default
        if (tmpArray.length === 0) {
            tmpArray.push({
                id: 1,
                fileDataURL: '',
                nrOfCopies: 1
            })
        }
        this.setState({data: tmpArray})
    }

    preparePDF = () => {
        let pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        })
      
        let index = 0
        let page = 0
        let row = 0
        let col = 0
        let marginLeft = 10
        let marginTop = 10
        let cardWidth = 63
        let cardHeight = 88
        let cardMarginRight = 2
        let cardMarginTop = 2

        for (const element of this.state.data) {
            for(let i=0;i<element.nrOfCopies;i++){
                row = Math.floor(index / 3) 
                col = index % 3
                
                if (row > 2) {                    
                    pdf.addPage()
                    page++
                    index = 0
                    row = Math.floor(index / 3) 
                    col = index % 3
                }

                index++

                pdf.addImage(element.fileDataURL, 'PNG',
                    marginLeft + (col * (cardWidth + cardMarginRight)),
                    marginTop + (row * (cardHeight + cardMarginTop)),
                    cardWidth,
                    cardHeight
                )
            }
        }
      
          pdf.save('mtg-proxies.pdf')
    }

    render = () => {

        let proxies = []
        let index = 0
        for (let data of this.state.data) {            
            proxies.push(<Proxy data={data} index={index} 
                                onUpdateData={this.onUpdateData} 
                                onRemoveProxy={this.removeProxyCard} 
                                onAddProxy={this.addProxyCard} 
                                key={data.id}/>)
            index++
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
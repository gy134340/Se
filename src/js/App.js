import React, { Component } from 'react'
// import logo from '../img/logo.svg';
import '../css/app'

class Item extends Component {
  constructor(props) {
    super(props)
    this.input = '';
    this.state = {
      item: props.item,
      isEditable: false,
    }
  }

  handleEdit = () => {
    const { item } = this.state
    this.setState({
      isEditable: true,
    }, () => {
      const tmp = this.input.value
      this.input.value = ''
      this.input.focus()
      this.input.value = tmp
    })
  }

  handleChange = (e) => {
    const { value } = e.target
    const { item } = this.state

    this.setState({
      item: {...item, name: value}
    })
  }

  handleLinkChange = (e) => {
    const { value } = e.target
    const { item } = this.state

    this.setState({
      item: {...item, link: value}
    })
  }

  handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      const { item } = this.state;
      this.setState({
        isEditable: false,
      }, () => {
        this.props.onChange(item)
      }) 
    }
  }

  render() {
    const { isEditable, item } = this.state

    return (
      <div className="list">
        { isEditable ? 
          <input 
            type="text" 
            ref={input => this.input = input} 
            value={item.name}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
        />
          : <a className="list-link" href={item.link} target="_blank">{item.name}</a> 
        }

        <span className="edit" onClick={this.handleEdit}>
          <i className="edit-inner"></i>
        </span>

        {/* do not need now */}
        {/* <span className="delete" onClick={this.handleDelete}>
          <i className="up"></i>
          <i className="down"></i>
        </span> */}
        {
          isEditable &&
          <input
            type="text"
            ref={link => this.link = link}
            className="edit-link"
            value={item.link}
            onChange={this.handleLinkChange}
            onKeyDown={this.handleKeyDown}
          />
        }
        
      </div> 
    )
  }
  
}

// 要先进入主网站才能打开的意义大吗？？
// todo: 要不要加主网站索引, 搜索
class App extends Component {
  constructor(props) {
    super(props)
    this.input = ''
  
    this.state = {
      urlOrigin: '',
      isAdding: false,
      addingItem: {},
      lists: [],
    }
  }

  componentDidMount() {
    this.readFromStorage()
  }

  readFromStorage = () => {
    let lists
    /*eslint-disable no-undef*/
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.get('seLists', (data) => {
        lists = data.seLists || []
        this.setState({lists})
      })

      chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},
        (tabs) => {
          const url  = new URL(tabs[0].url)
          const urlOrigin = url.origin
          this.setState({
            urlOrigin,
          }) 
        }
      );
    }
  }

  writeToStorage = (lists) =>{
    /*eslint-disable no-undef*/
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.set({
        'seLists': lists,
      })
    }
  }

  enableAdd = () => {
    this.setState({
      isAdding: true,
    }, () => {
      this.input.focus()
    })
  }

  handleChange = (item) => {
    const { lists } = this.state
    let alteredIndex
    lists.forEach((list, index) => {
      if (list.id === item.id) {
        alteredIndex = index
      } 
    })
    const isDeleted = !item.name || !item.link
    if (isDeleted) {
      this.setState({
        lists: [...lists.slice(0, alteredIndex), ...lists.slice(alteredIndex + 1)]
      }, () => {
        const { lists } = this.state
        this.writeToStorage(lists)
      })
    } else {
      this.setState({
        lists: [...lists.slice(0, alteredIndex), item, ...lists.slice(alteredIndex + 1)]
      }, () => {
        const { lists } = this.state
        this.writeToStorage(lists)
      })
    }   
  }

  handleAddChange = (e) => {
    const { value } = e.target
    const { addingItem } = this.state

    this.setState({
      addingItem: {...addingItem, name: value}
    })
  }

  handleBlur = () => {
    let { addingItem } = this.state
    this.addLists(addingItem)
  }

  handleKeyDown = (e) => {
    if (e.keyCode === 13) { 
      const { addingItem } = this.state  
      this.addLists(addingItem)
    }
  }

  // isDuplicate = (name) => {
  //   const { lists } = this.state
  //   const list = lists.find((item) => item.name === name)
  //   return !!list
  // }

  addLists = (item) => {
    const { lists } = this.state
    if (!!item.name) {
      // if (this.isDuplicate(item.name)) {
      //   this.setState({
      //     isAdding: false,
      //     addingItem: {},
      //   }, () => {
      //     alert('Duplicate name')
      //   })
      //   return
      // }
      const id = Math.floor(Math.random() * 1000) + '' + new Date().getTime()
      chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},
        (tabs) => {
            const url  = new URL(tabs[0].url)
            const home = url.origin
            const link = url.href
            item = {...item, id, home, link}
            this.setState({
              isAdding: false,
              addingItem: {},
              lists: [...lists, item]
            }, () => {
              const { lists } = this.state
              this.writeToStorage(lists)
            })
        }
      );
      // const home = window.location.origin
      // const link = window.location.href
      // item = {...item, id, home, link}
      // this.setState({
      //   isAdding: false,
      //   addingItem: {},
      //   lists: [...lists, item]
      // }, () => {
      //   const { lists } = this.state
      //   this.writeToStorage(lists)
      // })
    } else {
      this.setState({
        isAdding: false,
        addingItem: {},
      })
    }
  }

  render() {
    const { lists, addingItem, isAdding, urlOrigin } = this.state
    const List = lists.map((item, index) => {
      return ((item.home === urlOrigin) &&
        <Item 
          key={JSON.stringify(item)} 
          item={item}
          urlOrigin={urlOrigin} 
          onChange={this.handleChange}
        />
      )
    })

    return (
      <div className="s-app">
        <div className="s-container">
          <div className="list-add">
            <span className="add-text" onClick={this.enableAdd}>+</span>
            {
              isAdding &&
              <input 
                className="item-add"
                type="text"
                ref={input => this.input = input}
                placeholder="Add tmp page as..."
                value={addingItem.name || ''}
                onChange={this.handleAddChange}
                onKeyDown={this.handleKeyDown}
                onBlur={this.handleBlur}
              />
            }
            
          </div>
          <div className="lists">
            { List }
          </div>
        </div>
      </div>
    );
  }
}

export default App;

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
      <div className="list" key={item.id}>
        { isEditable ? 
          <input 
            type="text" 
            ref={input => this.input = input} 
            value={item.name}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
        />
          : <a className="list-link" href={item.link}>{item.name}</a> 
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
      isAdding: false,
      addingItem: {},
      lists: [
        {
          id: 1,
          name: 'MR',
          home: 'github.com',
          link: 'https://github.com/mr',
        },
        {
          id: 2,
          name: 'issue',
          home: 'github.com',
          link: 'https://github.com/issue',
        },
        {
          id: 3,
          name: 'branch',
          home: 'github.com',
          link: 'https://github.com/issue',
        },
        {
          id: 4,
          name: 'MR',
          home: 'github.com',
          link: 'https://github.com/mr',
        },
        // {
        //   id: 5,
        //   name: 'issue',
        //   home: 'github.com',
        //   link: 'https://github.com/issue',
        // },
        // {
        //   id: 6,
        //   name: 'branch',
        //   home: 'github.com',
        //   link: 'https://github.com/issue',
        // },
        // {
        //   id: 7,
        //   name: 'MR',
        //   home: 'github.com',
        //   link: 'https://github.com/mr',
        // },
        // {
        //   id: 8,
        //   name: 'issue',
        //   home: 'github.com',
        //   link: 'https://github.com/issue',
        // },
      ]
    }
  }

  addList = (item) => {
    const { lists } = this.state
    if (!!item.name) {
      this.setState({
        isAdding: false,
        addingItem: {},
        lists: [...lists, item]
      })
    } else {
      this.setState({
        isAdding: false,
        addingItem: {},
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

  handleAdd = (e) => {
    const { value } = e.target
    const { addingItem } = this.state

    this.setState({
      addingItem: {...addingItem, name: value}
    })

  }

  handleBlur = () => {
    let { addingItem } = this.state

    // todo: remove
    addingItem = {
      ...addingItem,
      id: 1000,
      home: '1',
      link: 'testststs'
    }
    this.addList(addingItem)
  }

  handleKeyDown = (e) => {
    if (e.keyCode === 13) { 
      let { addingItem } = this.state

      // todo: remove
      addingItem = {
        ...addingItem,
        id: 1000,
        home: '1',
        link: 'testststs'
      }
      this.addList(addingItem)
    }
  }

  handleChange = (item) => {
    const { lists, addingItem } = this.state
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
      })
    } else {
      this.setState({
        lists: [...lists.slice(0, alteredIndex), item, ...lists.slice(alteredIndex + 1)]
      })
    }   
  }


  render() {
    const { lists, addingItem, isAdding } = this.state
    const List = lists.map((item, index) => {
      return (
        <Item 
          key={item.id} 
          item={item} 
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
                value={addingItem.name}
                onChange={this.handleAdd}
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

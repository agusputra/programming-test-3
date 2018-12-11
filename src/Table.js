import React from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import ColumnHead from './ColumnHead'
import ColumnBody from './ColumnBody'

const getItemStyle = (isDragging, draggableStyle) => ({
  background: isDragging ? 'deeppink' : 'transparent',
  ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'transparent',
});

export default class Table extends React.Component {
  constructor(props) {
    super(props)

    const items = []
    items[props.positions['@makeschool']] = { username: '@makeschool', tweets: props.makeschool }
    items[props.positions['@newsycombinator']] = { username: '@newsycombinator', tweets: props.news }
    items[props.positions['@ycombinator']] = { username: '@ycombinator', tweets: props.ycombinator }

    this.state = { dragDirection: null, items }

    console.log(props.positions)

    this.handleDragEnd = this.handleDragEnd.bind(this)
    this.handleResize = this.handleResize.bind(this)
  }

  componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  static getDerivedStateFromProps(props, state) {
    let items = [...state.items]

    if (props.makeschool)
      items.find(item => item.username === '@makeschool').tweets = props.makeschool
    if (props.news)
      items.find(item => item.username === '@newsycombinator').tweets = props.news
    if (props.ycombinator)
      items.find(item => item.username === '@ycombinator').tweets = props.ycombinator

    return { items }
  }

  handleResize() {
    if (window.innerWidth <= 576) {
      this.setState({ dragDirection: 'vertical' })
    } else {
      this.setState({ dragDirection: 'horizontal' })
    }
  }

  getDraggable(item, index) {
    return (
      <Draggable key={item.username} draggableId={item.username} index={index}>
        {(provided, snapshot) => (
          <div className="table-column col-lg-4 col-sm-6"
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={getItemStyle(
              snapshot.isDragging,
              provided.draggableProps.style)}>
            <div className="card">
              <ColumnHead title={item.username} />
              <ColumnBody tweets={item.tweets} />
            </div>
          </div>
        )}
      </Draggable>
    )
  }

  handleDragEnd(result) {
    if (!result.destination) {
      return
    }

    const items = reOrder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    const positions = {}
    items.forEach((item, index) => positions[item.username] = index)

    this.props.onChangeOrder(positions)
    this.setState({ items })
  }

  render() {
    return (
      <DragDropContext onDragEnd={this.handleDragEnd}>
        <Droppable droppableId="droppable" direction={this.state.dragDirection}>
          {(provided, snapshot) => (
            <div className="row"
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
              {...provided.droppableProps}>

              {this.state.items.map((item, index) => this.getDraggable(item, index))}

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    )
  }
}

function reOrder(list, startIndex, endIndex) {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}
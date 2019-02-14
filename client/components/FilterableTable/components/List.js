import React from 'react';

import ListItem from './ListItem';


const List = ({ list }) => (

  <ul>

    { list.map((listItem, index) => <ListItem key={ index } text={ listItem.name } />) }

  </ul>

);

export default List;

//
// 'map()' method passes each element of the array on which it is invoked to the specified 'function'
// 'map()' method returns an 'array' containing the values returned by that specified 'function'
// the 'function' passed to 'map()' is invoked in the same way as a function passed to 'forEach()'

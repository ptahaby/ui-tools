import React, { useEffect } from 'react';
import { setup } from './utils';
import './styles.css';

function DragAndDrop() {
  useEffect(() => {
    setup();
  }, []);

  return (
    <div className="list">
      <div className="item is-idle ">
        item 🍦 : 1<div className="drag-handle"></div>
      </div>
      <div className="item is-idle ">
        item 🍦 : 2<div className="drag-handle"></div>
      </div>
      <div className="item is-idle ">
        item 🍦 : 3<div className="drag-handle"></div>
      </div>
      <div className="item is-idle ">
        item 🍦 : 4<div className="drag-handle"></div>
      </div>
      <div className="item is-idle ">
        item 🍦 : 5<div className="drag-handle"></div>
      </div>
    </div>
  );
}

export default DragAndDrop;

// A lightweight, manually rotated room study for the SpaceSketch preview.
(() => {
  let instance = 0;

  window.mountSpaceSketchPreview = (host) => {
    const root = document.createElement('div');
    root.className = 'room-preview';
    const viewport = document.createElement('div');
    viewport.className = 'room-viewport';
    viewport.setAttribute('role', 'img');
    viewport.setAttribute(
      'aria-label',
      'An isometric room study with a green sofa, coffee table, rug, window, and plant.',
    );
    const caption = document.createElement('span');
    caption.className = 'room-caption';
    caption.textContent = 'A SPACE TO MAKE YOUR OWN';
    caption.setAttribute('aria-hidden', 'true');
    const room = document.createElement('div');
    room.className = 'room-object';
    room.setAttribute('aria-hidden', 'true');

    function element(className, parent = room) {
      const node = document.createElement('div');
      node.className = className;
      parent.append(node);
      return node;
    }
    function cuboid(x, y, z, width, depth, height, colors, extraClass = '') {
      const box = element(`room-cuboid ${extraClass}`.trim());
      Object.entries({
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${depth}px`,
        transform: `translateZ(${z}px)`,
        '--box-height': `${height}px`,
        '--box-top': colors[0],
        '--box-front': colors[1],
        '--box-side': colors[2],
      }).forEach(([name, value]) => box.style.setProperty(name, value));
      for (const side of ['top', 'front', 'back', 'left', 'right']) {
        element(`room-box-${side}`, box);
      }
      return box;
    }

    cuboid(
      0,
      0,
      0,
      190,
      170,
      5,
      ['#e5ddc8', '#c8bea7', '#b9af98'],
      'room-floor',
    );
    const back = element('room-wall-back');
    element('room-window', back);
    element('room-wall-side');
    element('room-rug');

    const green = ['#81936d', '#637753', '#526547'];
    cuboid(20, 24, 5, 76, 35, 13, green);
    cuboid(20, 23, 5, 76, 7, 34, green);
    cuboid(20, 30, 5, 7, 29, 25, green);
    cuboid(89, 30, 5, 7, 29, 25, green);
    cuboid(29, 32, 18, 28, 24, 4, ['#a1af8c', '#8a9b74', '#778961']);
    cuboid(59, 32, 18, 28, 24, 4, ['#9aaa84', '#82966b', '#71825d']);

    const timber = ['#9b7955', '#866442', '#735338'];
    for (const [x, y] of [
      [117, 91],
      [144, 91],
      [117, 118],
      [144, 118],
    ]) {
      cuboid(x, y, 5, 3, 3, 21, timber);
    }
    element('room-tabletop');
    cuboid(155, 23, 5, 13, 13, 12, ['#c9a381', '#b98d68', '#a47956']);
    cuboid(160, 28, 17, 3, 3, 16, ['#7c7950', '#6a6743', '#58573a']);
    for (const [size, z] of [
      [27, 28],
      [22, 34],
      [15, 39],
    ]) {
      const leaf = element('room-foliage');
      leaf.style.width = leaf.style.height = `${size}px`;
      leaf.style.left = `${161.5 - size / 2}px`;
      leaf.style.top = `${29.5 - size / 2}px`;
      leaf.style.transform = `translateZ(${z}px)`;
    }
    viewport.append(caption, room);

    const controls = document.createElement('div');
    controls.className = 'room-controls';
    const heading = document.createElement('div');
    heading.className = 'room-control-heading';
    const label = document.createElement('label');
    const sliderId = `room-rotation-${++instance}`;
    label.htmlFor = sliderId;
    label.textContent = 'Rotate room';
    const output = document.createElement('output');
    output.htmlFor = sliderId;
    output.setAttribute('aria-live', 'off');
    heading.append(label, output);
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.id = sliderId;
    slider.className = 'room-rotation';
    slider.min = '0';
    slider.max = '360';
    slider.step = '1';
    slider.value = '35';
    const buttons = document.createElement('div');
    buttons.className = 'room-buttons';
    buttons.setAttribute('role', 'group');
    buttons.setAttribute('aria-label', 'Room view controls');
    const listeners = [];
    function listen(node, type, callback) {
      node.addEventListener(type, callback);
      listeners.push(() => node.removeEventListener(type, callback));
    }
    function update(angle) {
      slider.value = String(angle);
      room.style.setProperty('--room-angle', `${angle}deg`);
      output.textContent = `${angle}°`;
      slider.setAttribute('aria-valuetext', `${angle} degrees`);
    }
    listen(slider, 'input', () => update(Number(slider.value)));
    for (const [text, action] of [
      ['Rotate left', () => update((Number(slider.value) + 330) % 360)],
      ['Rotate right', () => update((Number(slider.value) + 30) % 360)],
      ['Reset view', () => update(35)],
    ]) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'interaction-button room-view-button';
      button.textContent = text;
      listen(button, 'click', action);
      buttons.append(button);
    }
    controls.append(heading, slider, buttons);
    root.append(viewport, controls);
    host.replaceChildren(root);
    update(35);

    return () => {
      listeners.forEach((remove) => remove());
      root.remove();
    };
  };
})();

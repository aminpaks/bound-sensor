import { BoundSensor, BoundSensorEvent, BoundSensorOptions } from 'bound-sensor';

const child = window.document.getElementById('child');
const holder = window.document.getElementById('holder');
const elWidth = window.document.getElementById('el-width');
const elHeight = window.document.getElementById('el-height');
const sampleText = window.document.getElementById('sample-text');
const detachSensor = window.document.getElementById('detach-sensor');
const randomContent = window.document.getElementById('random-content');

const eventName = 'resize';

const bSensor = new BoundSensor({
  eventName,
  modifyStyles: false,
  debounceTime: 10,
});

holder.addEventListener(eventName, function (event: BoundSensorEvent) {
  elWidth.innerHTML = 'width: ' + event.detail.width;
  elHeight.innerHTML = 'height: ' + event.detail.height;
});

randomContent.addEventListener('click', function () {
  randomContent.setAttribute('disabled', 'disbaled');

  holder.style.width = '60%';
  holder.style.height = 'auto';
  holder.style.overflow = 'auto';

  const addContent = function () {
    const content = [];
    for (let i = 0; i < Math.random() * 10000; i++) {
      content.push('<span>Sample short text</span>');
    }
    sampleText.innerHTML = content.join(' ');
  };

  addContent();

  window.setInterval(addContent, 2000);
});

detachSensor.addEventListener('click', function () {
  bSensor.detachSensor();
});

bSensor.attachSensor(holder);

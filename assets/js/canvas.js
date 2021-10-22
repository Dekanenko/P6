function canvas(selector, options){
    const canvas = document.querySelector(selector);
    canvas.classList.add('canvas')
    canvas.setAttribute('width', `${options.width || 400}px`)
    canvas.setAttribute('height', `${options.height || 300}px`)

    const context = canvas.getContext('2d')
  
    const rect = canvas.getBoundingClientRect();

    let isPaint = false 
    let points = [] 

    const addPoint = (sSize, sColor, x, y, dragging) => {
    points.push({
        sSize,
        sColor,
        x: (x - rect.left),
        y: (y - rect.top),
        dragging: dragging
    })
    }

    const redraw = () => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    context.lineJoin = "round";
    let prevPoint = null;
    for (let point of points){
        context.strokeStyle = point.sColor;
        context.lineWidth = point.sSize;
        context.beginPath();
        if (point.dragging && prevPoint){
            context.moveTo(prevPoint.x, prevPoint.y)
        } else {
            context.moveTo(point.x - 1, point.y);
        }
        context.lineTo(point.x, point.y)
        context.closePath()
        context.stroke();
        prevPoint = point;
    }
    }

    const mouseDown = event => {
    isPaint = true
    addPoint(context.lineWidth, context.strokeStyle, event.pageX, event.pageY);
    redraw();
    }

    const mouseMove = event => {
    if(isPaint){
        addPoint(context.lineWidth, context.strokeStyle, event.pageX, event.pageY, true);
        redraw();
    }
    }

    canvas.addEventListener('mousemove', mouseMove)
    canvas.addEventListener('mousedown', mouseDown)
    canvas.addEventListener('mouseup',() => {
    isPaint = false;
    });
    canvas.addEventListener('mouseleave',() => {
    isPaint = false;
    });

    const toolBar = document.getElementById('toolbar');

    const clearBtn = document.createElement('button');
    clearBtn.innerHTML = '<i class="fas fa-snowplow"></i>';
    clearBtn.addEventListener('click', () => {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        points = [];
    })

    toolBar.insertAdjacentElement('afterbegin', clearBtn);
   
    const dLoad = document.createElement('button');
    dLoad.innerHTML = '<i class="fas fa-download"></i>';
    dLoad.addEventListener('click', () => {
        const dataUrl = canvas.toDataURL("image/png").replace(/^data:image\/[^;]/, 'data:application/octet-stream');
        const newTab = window.open('about:blank','image from canvas');
        newTab.document.write("<img src='" + dataUrl + "' alt='from canvas'/>");
    })
    toolBar.insertAdjacentElement('afterbegin', dLoad);

    const saveBtn = document.createElement('button');
    saveBtn.innerHTML = '<i class="fas fa-save"></i>';
    saveBtn.addEventListener('click', () => {
        localStorage.setItem('points', JSON.stringify(points));
    })
    toolBar.insertAdjacentElement('afterbegin', saveBtn);

    const restoreBtn = document.createElement('button');
    restoreBtn.innerHTML = '<i class="fas fa-trash-restore"></i>';
    restoreBtn.addEventListener('click', () => {
        const raw = localStorage.getItem('points');
        points = JSON.parse(raw);
        redraw();
    })
    toolBar.insertAdjacentElement('afterbegin', restoreBtn);


    /*
    const img = new Image;
    //img.src =`https://www.fillmurray.com/200/300)`;
    img.src = "assets/img/im.png"
    img.onload = () => {
    context.drawImage(img, 0, 0);
    }
    */
    
 }
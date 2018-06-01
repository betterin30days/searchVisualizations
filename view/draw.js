'use strict';

const styleParameters = (
    fillStyle,
    strokeStyle,
    lineWidth,
    fontSize,
    fontName,
    textAlign,
    xMargin = 0,
    yMargin = 0,
    xSpacing = {},
    ySpacing = {}
) => {
    // creates an object of default drawing style parameters
    // all required params will map to canvas ctx params
    // all optionals can be used for layout purposes
    // xSpacing and ySpacing are optional objects
    // this can be used for user defined implementations such as
    // xSpacing = {gutter: 2, imageSpacing: 2}
    const params = {
        fillStyle: fillStyle,
        strokeStyle: strokeStyle,
        lineWidth: lineWidth,
        fontSize: fontSize,
        fontName: fontName,
        textAlign: textAlign,
        xMargin: xMargin,
        yMargin: yMargin,
        xSpacing: xSpacing,
        ySpacing: ySpacing
    };
    return params;
};

const updateCanvasStyle = (ctx, params) => {
    // updates the canvas ctx formatting
    // uses the information from the provided params object
    ctx.fillStyle = params.fillStyle;
    ctx.strokeStyle = params.strokeStyle;
    ctx.lineWidth = params.lineWidth;
    const font = params.fontSize.toString() + 'px ' + params.fontName;
    ctx.font = font;
    ctx.textAlign = params.textAlign;
};

const drawStats = (ctx, target, height, nodes, step, styleParams) => {
    // draws the basic stats to the canvas
    ctx.font = (styleParams.fontSize * 1.5).toString() + 'px ' + styleParams.fontName;
    ctx.fillText(
        'Search Target: ' + target,
        2,
        styleParams.xMargin
    );
    ctx.fillText(
        'Tree Height: ' + height,
        2,
        styleParams.xMargin * 2
    );
    ctx.fillText(
        'Total Nodes: ' + nodes,
        2,
        styleParams.xMargin * 3
    );
    ctx.fillText(
        'Current Search Step: ' + (step + 1),
        2,
        styleParams.xMargin * 4
    );
};

const drawArrayField = (ctx, searchField, x, y, xSpacing, styleParams) => {
    // draw the search field in array form
    ctx.textAlign = 'center';
    for (let i = 0; i < searchField.length; i++) {
        ctx.fillText(
            searchField[i],
            x + styleParams.xMargin + (i * xSpacing),
            y
        );
    }
};

const _drawSearchPath = (
    ctx,
    step,
    index,
    xSpacing,
    xOrigin,
    yOrigin,
    yEnd,
    correctPath,
    styleParams
) => {
    // draw single search path
    // searchPath is an array of indexes
    const xEnd = styleParams.xMargin + index * xSpacing; // x of number
    // draw line path
    // horizontal
    ctx.strokeStyle = '#33cc33'; // green
    ctx.beginPath();
    ctx.moveTo(xOrigin, yOrigin + (step * xSpacing));
    ctx.lineTo(xEnd, yOrigin + (step * xSpacing));
    ctx.stroke();
    // xOrigin = xEnd;
    // vertical part 1
    ctx.beginPath();
    ctx.moveTo(xEnd, yOrigin + (step * xSpacing));
    ctx.lineTo(xEnd, yOrigin + (xSpacing * (step + 1))); // center is 1/2 fontSize and radius is fontSize
    ctx.stroke();
    // change color if this is an incorrect path
    ctx.strokeStyle = correctPath ? ctx.strokeStyle : '#cc0000'; // red
    // vertical part 2
    ctx.beginPath();
    ctx.moveTo(xEnd, yOrigin + (xSpacing * (step + 1)));
    ctx.lineTo(xEnd, yEnd - (styleParams.fontSize * 1.5)); // center is 1/2 fontSize and radius is fontSize
    ctx.stroke();
    // draw outline circle
    ctx.beginPath();
    ctx.arc(xEnd, yEnd - (styleParams.fontSize/2), styleParams.fontSize, 0, 2 * Math.PI);
    // this centers the circle on the font
    ctx.stroke();
};

const drawSearchPath = (
    ctx,
    searchField,
    searchTarget,
    path,
    step,
    xSpacing,
    yOrigin,
    yEnd,
    styleParams
) => {
    // public api to draw the array search paths
    for (let i = 0; i <= step; i++) {
        const correctPath = searchField[path[i]] == searchTarget;
        const xOrigin = styleParams.xMargin + path[i - 1] * xSpacing; // center number is first
        _drawSearchPath(
            ctx,
            i,
            path[i],
            xSpacing,
            xOrigin,
            yOrigin,
            yEnd,
            correctPath,
            styleParams
        );
    }
};

const drawBst = (ctx, tree, step, path, x, y, layerSpacing, height, styleParams) => {
    ctx.textAlign = 'center';
    // draw current node
    ctx.fillText(tree.k, x, y);
    ctx.beginPath();
    if (step !== -1 && path[step] === tree.v) {
        // currently searching on this node
        ctx.strokeStyle = '#0061ff'; // blue
        ctx.lineWidth = 4;
    }
    ctx.arc(x, y, styleParams.fontSize, 0, 2 * Math.PI);
    ctx.stroke();
    // reset values
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    // parents draw lines to their children
    // then recursively draw lower nodes
    if (tree.l) {
        ctx.beginPath();
        ctx.moveTo(x - styleParams.fontSize, y); // x - radius
        ctx.lineTo(
            x - layerSpacing - (Math.pow(5, height)), // childX center
            y + layerSpacing - styleParams.fontSize // childY - radius
        );
        ctx.stroke();
        drawBst(
            ctx,
            tree.l,
            step,
            path,
            x - layerSpacing - (Math.pow(5, height)),
            y + layerSpacing,
            layerSpacing,
            height - 1,
            styleParams
        );
    }
    if (tree.r) {
        ctx.beginPath();
        ctx.moveTo(x + styleParams.fontSize, y); // x + radius
        ctx.lineTo(
            x + layerSpacing + (Math.pow(5, height)), // childX center
            y + layerSpacing - styleParams.fontSize // childY - radius
        );
        ctx.stroke();
        drawBst(
            ctx,
            tree.r,
            step,
            path,
            x + layerSpacing + (Math.pow(5, height)),
            y + layerSpacing,
            layerSpacing,
            height - 1,
            styleParams
        );
    }
};

export {
    styleParameters,
    updateCanvasStyle,
    drawStats,
    drawArrayField,
    drawSearchPath,
    drawBst
};
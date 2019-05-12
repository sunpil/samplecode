export const getTextSize = (text, opt) => {
    if (text == "") {
        return { width : 0, height : 0 };
    }

    opt = opt || {};

    var bodyElement = document.body || root.element;

    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttributeNS(null, "width", 500);
    svg.setAttributeNS(null, "height", 100);
    svg.setAttributeNS(null, "x", -20000);
    svg.setAttributeNS(null, "y", -20000);

    var el = document.createElementNS("http://www.w3.org/2000/svg", "text");
    el.setAttributeNS(null, "x", -200);
    el.setAttributeNS(null, "y", -200);
    el.appendChild(document.createTextNode(text));

    if (opt.fontSize) {
        el.setAttributeNS(null, "font-size", opt.fontSize);
    }

    if (opt.fontFamily) {
        el.setAttributeNS(null, "font-family", opt.fontFamily);
    }

    if (opt.bold) {
        el.setAttributeNS(null, "font-weight", opt.bold);
    }

    if (opt.style) {
        el.setAttributeNS(null, "font-style", opt.style);
    }


    svg.appendChild(el);

    bodyElement.appendChild(svg);
    var rect = el.getBoundingClientRect();
    bodyElement.removeChild(svg);

    return { width : rect.width, height : rect.height };
}

export const getMaxDomainValue = (domainValue) => {
    for (let i = 1; i < 1000; i++) {
        domainValue = domainValue / 10;
        if (domainValue < 1) {
            if (i === 1) {
                return Math.ceil(domainValue) * 10;
            } else {
                if ((Math.ceil(domainValue * 10) - (domainValue * 10)) < 0.1) {
                    domainValue = Math.ceil(domainValue * 10) + 0.1;
                } else {
                    domainValue = Math.ceil(domainValue * 10);
                }
                return domainValue * Math.pow(10, i - 1);
            }
        }
    }
    
    return Math.ceil(domainValue);
}

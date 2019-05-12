import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export function pdfDownload(pdfInfo, callFunc) {
  var pdf = new jsPDF("p", "mm");
  var pageHeightLeft = pdfInfo.pageHeight;
  var divToPdfs = document.querySelectorAll(`div[class*='${pdfInfo.divToPdfClassName}']`);
  generatePDF(pdf, divToPdfs, 1, pageHeightLeft, pdfInfo, callFunc);
}

export function generatePDF(pdf, divToPdfs, idx, pageHeightLeft, pdfInfo, callFunc) {
  html2canvas(divToPdfs[idx-1], {onclone: function(clonedDoc) {
    clonedDoc.querySelector("body").style.zoom = pdfInfo.bodyZoom;
    const divCanvas = clonedDoc.querySelectorAll("div canvas");
    for (let i = 0; i < divCanvas.length; i++) {
      const item = divCanvas.item(i);
      item.style.setProperty("zoom", pdfInfo.canvasZoom, "important");
    }
    const clonedPdfs = clonedDoc.querySelectorAll(`div[class*='${pdfInfo.divToPdfClassName}']`);
    let headerIdx = 0;
    for (let i = 0; i < clonedPdfs.length; i++) {
      const item = clonedPdfs.item(i);
      let nodeIdx = 0;
      if (item.className.indexOf(`${pdfInfo.divToPdfClassName}Title`) > -1) {
        if (pdfInfo.title || pdfInfo.subTitle) {
          const divTitle = document.createElement("div");
          if (pdfInfo.title) {
            const sectionTitle = document.createElement("section");
            sectionTitle.className = "col col-xs-12 col-sm-12 col-md-12 col-lg-12";
            sectionTitle.style = pdfInfo.titleStyle;
            const divTitleText = document.createTextNode(pdfInfo.title);
            sectionTitle.appendChild(divTitleText);
            divTitle.appendChild(sectionTitle);
          }
          if (pdfInfo.subTitle) {
            const sectionSubTitle = document.createElement("section");
            sectionSubTitle.className = "col col-xs-12 col-sm-12 col-md-12 col-lg-12";
            sectionSubTitle.style = pdfInfo.subTitleStyle;
            const divSubTitleText = document.createTextNode(pdfInfo.subTitle);
            sectionSubTitle.appendChild(divSubTitleText);
            divTitle.appendChild(sectionSubTitle);
          }
          item.insertBefore(divTitle, item.childNodes[nodeIdx++]);
        }
      }
      if (item.className.indexOf(`${pdfInfo.divToPdfClassName}Header`) > -1) {
        if (pdfInfo.headers && pdfInfo.headers[headerIdx]) {
          const divHeader = document.createElement("div");
          divHeader.style = pdfInfo.headerStyle;
          const divHeaderText = document.createTextNode(pdfInfo.headers[headerIdx++]);
          divHeader.appendChild(divHeaderText);
          item.insertBefore(divHeader, item.childNodes[nodeIdx++]);
        }
      }
      if (item.className.indexOf(`${pdfInfo.divToPdfClassName}`) > -1) {
        const divClear = document.createElement("div");
        divClear.style.clear = "both";
        item.appendChild(divClear);
      }  
    }
  }}).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    let imgHeight = canvas.height * pdfInfo.pageWidth / canvas.width;

    if (idx != 1 && pageHeightLeft < imgHeight) {
      pdf.addPage();
      pageHeightLeft = pdfInfo.pageHeight;
    }
    
    let heightLeft = imgHeight;
    let position = pdfInfo.pageHeight - pageHeightLeft;
    pdf.addImage(imgData, "PNG", pdfInfo.pageLeftRightMargin, position + pdfInfo.pageTopBottomMargin, pdfInfo.pageWidth, imgHeight);
    heightLeft -= pdfInfo.pageHeight;

    if (heightLeft < 0) {
      pageHeightLeft = pageHeightLeft - (pdfInfo.pageHeight + heightLeft);
    }

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pageHeightLeft = pdfInfo.pageHeight;
      pdf.addImage(imgData, "PNG", pdfInfo.pageLeftRightMargin, position + pdfInfo.pageTopBottomMargin, pdfInfo.pageWidth, imgHeight);
      heightLeft -= pdfInfo.pageHeight;
      if (heightLeft < 0) {
        pageHeightLeft = pageHeightLeft - (pdfInfo.pageHeight + heightLeft);
      }  
    }

    if (idx == divToPdfs.length) {
      pdf.save(pdfInfo.pdfName);
      if (callFunc) {
        callFunc();
      }
    } else {
      generatePDF(pdf, divToPdfs, ++idx, pageHeightLeft, pdfInfo, callFunc);
    }
  });
}

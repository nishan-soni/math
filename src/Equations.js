import React, { Component } from 'react'
import { Group, Rect } from 'react-konva'
import Equation from './Equation.js'
import Slider from './Slider.js'

import stringSimilarity from 'string-similarity'

import json from './equations.json'

class Equations extends Component {
  constructor(props) {
    super(props)
    window.Equations = this
    this.state = {
      equations: [],
    }
  }

  componentDidMount() {
    this.init()
  }

  async fetchData(url) {
    try {
      const response = await fetch(url)
      if (url.includes('json')) {
        return await response.json()
      } else {
        return await response.text()
      }
    } catch (error) {
      console.error(error);
    }
  }

  async init() {
    const threshold = App.threshold
    const url = `${App.domain}/public/sample/math-${App.sampleId}.json`
    let equations = await this.fetchData(url)
    window.mathocr = equations

    const url2 = `${App.domain}/public/sample/mathpix-${App.sampleId}.md`
    let mathpix = await this.fetchData(url2)
    window.mathpix = mathpix

    equations = equations.filter(e => e.score > threshold)
    equations = equations.map((equation) => {
      equation.x = equation.bbox[0][0]
      equation.y = equation.bbox[0][1]
      equation.width = equation.bbox[2][0] - equation.x
      equation.height = equation.bbox[2][1] - equation.y
      return equation
    })

    let latexArray = this.extractEquations(mathpix)
    console.log(_.clone(latexArray))

    let items = []
    for (let eq of mathocr) {
      let box = eq.bbox
      let bbox = { minX: box[0][0], maxX: box[2][0], minY: box[0][1], maxY: box[2][1] }
      let raw = ''
      for (let textAnnotation of ocr.textAnnotations) {
        let description = textAnnotation.description
        let vertices = textAnnotation.boundingPoly.vertices
        let bb = { minX: vertices[0].x, maxX: vertices[2].x, minY: vertices[0].y, maxY: vertices[2].y }
        const offset = 5
        if ((bbox.minX - offset <= bb.minX && bb.maxX <= bbox.maxX + offset) && (bbox.minY - offset <= bb.minY && bb.maxY <= bbox.maxY + offset)) {
          raw += description
        } else {
        }
      }
      let text = this.simpleConversion(raw)
      items.push({ raw: raw, text: text, score: eq.score })
    }
    // console.log(items)
    items = items.filter(item => item.score > threshold)

    items = items.map((item) => {
      let [latex, i] = this.closestLatex(item, latexArray)
      item.latex = latex
      // _.pullAt(latexArray, [i])
      return item
    });
    console.log(items)

    const scores = items.map(item => item.score)
    for (let i = 0; i < equations.length; i++) {
      let equation = equations[i]
      let id = _.indexOf(scores, equation.score)
      if (items[id]) {
        equation.latex = items[id].latex
        equation.text = items[id].text
        equation.raw = items[id].raw
      }
      const equationRef = React.createRef()
      Canvas.equationRefs.push(equationRef)
      equations[i] = equation
    }
    equations = equations.filter(e => e.latex)
    console.log(equations)
    this.setState({ equations: equations })
  }

  simpleConversion(text) {
    text = text.replace(/√/g, "\\sqrt");
    text = text.replace(/²/g, "^{2}");
    text = text.replace(/³/g, "^{3}");
    text = text.replace(/sin/g, "\\sin");
    text = text.replace(/···/g, "\\cdots");
    text = text.replace(/≤/g, "\\leqslant");
    return text
  }

  closestLatex(item, latexArray) {
    const scoreThreshold = 0;
    let bestMatch = null;
    let bestScore = 0;
    let bestIndex = -1
    latexArray.forEach((latex, i) => {
      let score = this.compareStrings(item.text, latex);
      // if (item.text === 'f(a+h)-f(a)h(2a^{2}+4ah+2h^{2}5a-5h+1)(2a^{2}-5a+1)h2a^{2}+4ah+2h^{2}5a-5h+1-2a^{2}+5a-1h4ah2h^{2}5hh4a+2h-5') console.log(score, latex)
      if (score > bestScore && score >= scoreThreshold) {
        bestScore = score;
        bestMatch = latex;
        bestIndex = i
      }
    });
    return [bestMatch, bestIndex];
  }

  compareStrings(a, b) {
    return stringSimilarity.compareTwoStrings(a, b)
  }

  extractEquations(text) {
    // $...$ or $$...$$
    // text = text.replace(/\\begin{aligned}\n/g, '')
    // text = text.replace(/\\end{aligned}\n/g, '')
    // text = text.replace(/\\\\\n/g, '\\\\ ')
    text = text.replace(/\&/g, '')
    const regexs = [
     /\$\$\n([\s\S]*?)\n\$\$/g,
     /\$(.*?)\$/g,
    ]
    const equations = [];
    let match;
    for (let regex of regexs) {
      while ((match = regex.exec(text)) !== null) {
        equations.push(match[1]);
      }
    }
    return equations;
  }

  render() {
    return (
      <>
        { this.state.equations.map((equation, i) => {
          if (equation.score < 0.3) return <></>
          {/*if (i !== 4) return <></>*/}
          return (
            <Group key={i}>
              <Rect
                key={ `equation-rect-${i}` }
                x={ equation.x }
                y={ equation.y }
                width={ equation.width }
                height={ equation.height }
                fill={ equation.type === 'embedding' ? App.fillColorAlpha : App.highlightColorAlpha }
                stroke={ App.strokeColor }
                strokeWidth={ 3 }
              />
              <Equation
                key={ `equation-${i}` }
                ref={ Canvas.equationRefs[i] }
                id={ i }
                x={ equation.x }
                y={ equation.y }
                width={ equation.width }
                height={ equation.height }
                latex={ equation.latex }
              />
            </Group>
          )
        })}
        <Slider />
      </>
    )
  }
}

export default Equations
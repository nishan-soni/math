import { useEffect, useState } from "react";
import mathsteps from "mathsteps";
import { Text } from "react-konva";

/**
 * Step by Step component
 */
function StepByStep() {
  const [ocr, setOcr] = useState([]);
  const [equationBoxes, setEquationBoxes] = useState([]);
  const [equations, setEquations] = useState([]);

  // Get the OCR and Equation box results on dom mount
  useEffect(() => {
    async function getData() {
      let url = `${App.domain}/public/sample/ocr-${App.sampleId}.json`;
      await fetchOCR(url);
      url = `${App.domain}/public/sample/math-${App.sampleId}.json`;
      await fetchEquations(url);
    }
    getData();
  }, []);

  // Call the get symbols function when data is loaded
  useEffect(() => {
    if (ocr.length > 0 && equationBoxes.length > 0) {
      getSolutions();
    }
  }, [ocr, equationBoxes]);

  /**
   * Gets OCR from url
   * @param {*} url
   */
  async function fetchOCR(url) {
    try {
      const response = await fetch(url);
      const jsonData = await response.json();
      const ocr = jsonData;
      let textAnnotations = ocr.textAnnotations;
      textAnnotations.shift();
      //console.log("ocr", textAnnotations);
      setOcr(textAnnotations);
      return textAnnotations;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Gets equation boxes from url
   * @param {*} url
   */
  async function fetchEquations(url) {
    try {
      const response = await fetch(url);
      let response_equations = await response.json();
      response_equations = response_equations.filter((eq) => {
        return eq.score > 0.3;
      });
      setEquationBoxes(response_equations);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Gets the solutions for each equation and updates the state
   */
  function getSolutions() {
    equationBoxes.forEach((equationBox) => {
      const { bbox } = equationBox;
      const equationYmin = bbox[0][1];
      const equationYmax = bbox[2][1];
      const equationXmin = bbox[0][0];
      const equationXmax = bbox[2][0];
      let equationString = "";

      ocr.forEach((symbol) => {
        const ocrYmin = symbol.boundingPoly.vertices[0].y;
        const ocrYmax = symbol.boundingPoly.vertices[2].y;
        const ocrXmin = symbol.boundingPoly.vertices[0].x;
        const ocrXmax = symbol.boundingPoly.vertices[2].x;
        // Checking if the symbol fits inside the bbox
        if (
          equationYmin - 5 < ocrYmin &&
          ocrYmax < equationYmax + 5 &&
          equationXmin - 5 < ocrXmin &&
          ocrXmax < equationXmax + 5
        ) {
          // Before we add the string, we need to proccess it a bit by removing commas
          const new_symbol = symbol.description.replace(/\,/g, "");
          equationString += new_symbol;
        }
      });

      // Now that we have the string, we can perform the math steps on the string.
      let equation_obj = {};
      equation_obj.bbox = bbox;
      equation_obj.steps = [];
      equation_obj.equation = equationString;

      const steps = mathsteps.solveEquation(equationString);
      steps.forEach((step) => {
        equation_obj.steps.push({
          before_change: step.oldEquation.ascii(),
          change: step.changeType,
          after_change: step.newEquation.ascii(),
          num_substeps: step.substeps.length,
        });
      });

      equations.push(equation_obj);
    });

    setEquations(equations);
  }

  return (
    <>
      <Text text={"NISHAN SONI"} x={500} y={500} />
    </>
  );
}

export default StepByStep;

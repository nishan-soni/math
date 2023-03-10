import { useState } from "react";
import { Group, Rect, Circle, Text } from "react-konva";

function Steps(props) {
  const { equation_obj } = props;
  const { bbox, solveSteps } = equation_obj;
  const [visible, setVisible] = useState(false);

  // Defining dimensions for the steps box
  // X axis
  const size = App.size / 3;
  const minX = bbox[0][0] - 65;
  const maxX = minX + size;
  const centerX = (minX + maxX) / 2;

  // Y axis
  const minY = bbox[0][1];
  const maxY = minY + size;
  const centerY = (minY + maxY) / 2;

  // Other
  const marginX = 20;
  const marginY = 20;
  const increment = 10;
  const top = minY + marginY; // This will be incremented as the lines will render
  const bottom = maxY - marginY;
  const left = minX + marginX;
  const right = maxX - marginX;

  let spaceBetweenSteps = 30;
  let spaceBetweenText = 0;
  let spaceBetweenSubSteps = 0;

  return (
    <Group width={size} height={size}>
      {visible == false ? (
        /** This is a clickable rectangle that opens the step by step solution */
        <Rect
          x={bbox[0][0]}
          y={minY}
          width={bbox[2][0] - bbox[0][0]}
          height={bbox[2][1] - bbox[0][1]}
          transparent={true}
          onClick={() => {
            setVisible(true);
          }}
        />
      ) : (
        /** This is the rectangle for the step by step solution */
        <>
          <Rect
            x={minX}
            y={minY}
            width={size}
            height={size}
            fill="rgba(255,255,255,0.95)"
            stroke="#777"
            strokeWidth={1}
          />
          <Text
            text="Step by Step Solution."
            x={left}
            y={top}
            fontSize={20}
            fontStyle="bold"
          />
          <Text
            text="X"
            x={right - 20}
            y={top}
            fontSize={20}
            fontStyle="bold"
            fill={App.highlightColor}
            onClick={() => {
              setVisible(false);
            }}
          />
          {/* Loop through the steps */}
          {solveSteps.map((step, index) => {
            spaceBetweenSteps += spaceBetweenSubSteps;
            spaceBetweenSubSteps = 30 + step.substeps.length * 30;
            return (
              // The Step
              <>
                {/* The step number */}
                <Group>
                  <Text
                    text={`Step ${index + 1}: ${step.changeType}`}
                    fontSize={18}
                    x={left}
                    y={top + spaceBetweenSteps}
                  />
                </Group>
                {/* The substeps */}
                <Group>
                  {/* Loop through each substep */}
                  {step.substeps.map((substep, subStepIndex) => {
                    return (
                      <Text
                        text={`substep: ${subStepIndex + 1}: ${
                          substep.changeType
                        }`}
                        fontSize={16}
                        x={left}
                        y={top + spaceBetweenSteps + (subStepIndex + 1) * 30}
                      />
                    );
                  })}

                  {/* Loop through the substeps of each step */}
                </Group>
              </>
            );
          })}
        </>
      )}
    </Group>
  );
}

export default Steps;

import json
from cnstd import LayoutAnalyzer

sample_ids = ['11']
path = 'public/sample'

for sample_id in sample_ids:
  img = path + '/sample-' + sample_id + '.jpg'
  out = path + '/math-' + sample_id + '.json'
  analyzer = LayoutAnalyzer('mfd')
  equations = analyzer.analyze(img)

  items = []
  for equation in equations:
    item = {
      'type': equation['type'],
      'bbox': equation['box'].tolist(),
      'score': equation['score'],
    }
    items.append(item)

  with open(out, 'w') as file:
    json.dump(items, file, indent=2)
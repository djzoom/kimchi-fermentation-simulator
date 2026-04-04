# Kimchi Fermentation Simulator | 김치 발효 시뮬레이터 | 辣白菜发酵模拟器

**[Live Demo | 在线演示 | 라이브 데모](https://kimchi.0xgarfield.com/)**

Interactive web-based simulation of Korean kimchi (김치) fermentation, built on peer-reviewed food science models.

## Features

- **Scientific models** calibrated against Korean research data:
  - Baranyi & Roberts growth model: `μmax(T) = a₀ + a₁T + a₂T²`
  - Arrhenius temperature kinetics (Ea = 57.9 kJ/mol)
  - Sigmoid microbial succession model
- **Multi-stage fermentation** — simulate room temp → refrigerator transitions
- **Real-time interaction** — sliders and stage inputs update curves instantly
- **Recipe calculator** — input cabbage weight, get exact ingredient amounts (Korean government standard)
- **Trilingual UI** — English / 한국어 / 中文
- **Industry standards** — Codex CXS 223-2001, KS H 2169
- **Starter culture (母水/종균)** modeling — old kimchi brine as natural inoculant (backslopping)

## Model Validation

Optimal fermentation times compared against Korean research data:

| Temperature | Model Output | Published Data |
|-------------|-------------|----------------|
| 4°C         | ~9 days     | ~10 days       |
| 10°C        | ~3.5 days   | ~5 days        |
| 20°C        | ~1.5 days   | ~2 days        |
| 25°C        | ~0.8 days   | ~1 day         |

## Tech Stack

Pure HTML/CSS/JS — no build tools, no frameworks. Chart.js for visualization.

## Usage

Open `index.html` in any modern browser, or deploy to GitHub Pages.

```bash
# Local development
python3 -m http.server 8765
# Open http://localhost:8765
```

## Recipe Standard

Based on Korean government (농촌진흥청) proportions per 2.5kg cabbage:
- Chili powder: 80g (4.5g per 100g salted cabbage)
- Fish sauce: 45ml (3 tbsp)
- Shrimp paste: 30g (2 tbsp, ratio 3:2)
- Garlic: 36g (2.0g per 100g)

## Scientific References

- [Codex CXS 223-2001: Standard for Kimchi](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/en/?lnk=1&url=https://workspace.fao.org/sites/codex/Standards/CXS+223-2001/CXS_223e.pdf)
- [Development of Dynamic Model for Kimchi Ripening (PMC7465714)](https://pmc.ncbi.nlm.nih.gov/articles/PMC7465714/)
- [Evaluation of LAB Growth Kinetics via Modeling (LWT 2024)](https://www.sciencedirect.com/science/article/pii/S0023643824007424)
- [Temperature Impact on Microbial Profiles (Heliyon 2024)](https://www.sciencedirect.com/science/article/pii/S2405844024032055)
- [Isolation and Characterization of Kimchi Starters (PMC9728259)](https://pmc.ncbi.nlm.nih.gov/articles/PMC9728259/)

## License

MIT

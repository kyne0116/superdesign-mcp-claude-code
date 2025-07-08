#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { readFileSync, existsSync, mkdirSync } from "fs";
import { glob } from "glob";
import * as path from "path";
const server = new Server({
    name: "superdesign-mcp-server",
    version: "1.0.0",
});
// Tool schemas for Superdesign functionality
const GenerateDesignSchema = z.object({
    prompt: z.string().describe("Design prompt describing what to create"),
    design_type: z.enum(["ui", "wireframe", "component", "logo", "icon"]).describe("Type of design to generate"),
    variations: z.number().min(1).max(5).default(3).describe("Number of design variations to create"),
    framework: z.enum(["html", "react", "vue"]).default("html").describe("Framework for UI components")
});
const IterateDesignSchema = z.object({
    design_file: z.string().describe("Path to existing design file to iterate on"),
    feedback: z.string().describe("Feedback for improving the design"),
    variations: z.number().min(1).max(5).default(3).describe("Number of design variations to create")
});
const ExtractDesignSystemSchema = z.object({
    image_path: z.string().describe("Path to screenshot/image to extract design system from")
});
const ListDesignsSchema = z.object({
    workspace_path: z.string().optional().describe("Workspace path (defaults to current directory)")
});
// Get or create superdesign directory
function getSuperdeignDirectory(workspacePath) {
    const basePath = workspacePath || process.cwd();
    const superdesignDir = path.join(basePath, 'superdesign');
    if (!existsSync(superdesignDir)) {
        mkdirSync(superdesignDir, { recursive: true });
    }
    const designIterationsDir = path.join(superdesignDir, 'design_iterations');
    if (!existsSync(designIterationsDir)) {
        mkdirSync(designIterationsDir, { recursive: true });
    }
    const designSystemDir = path.join(superdesignDir, 'design_system');
    if (!existsSync(designSystemDir)) {
        mkdirSync(designSystemDir, { recursive: true });
    }
    return superdesignDir;
}
// Generate base filename from prompt
function generateBaseName(prompt) {
    return prompt.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 20);
}
// Superdesign system prompt
const SUPERDESIGN_SYSTEM_PROMPT = `# Role
You are a **senior front-end designer**.
You pay close attention to every pixel, spacing, font, color;
Whenever there are UI implementation task, think deeply of the design style first, and then implement UI bit by bit

# When asked to create design:
1. Build one single html page of just one screen to build a design based on users' feedback/task
2. You ALWAYS output design files in 'superdesign/design_iterations' folder as {design_name}_{n}.html (Where n needs to be unique like table_1.html, table_2.html, etc.) or svg file
3. If you are iterating design based on existing file, then the naming convention should be {current_file_name}_{n}.html, e.g. if we are iterating ui_1.html, then each version should be ui_1_1.html, ui_1_2.html, etc.

## When asked to design UI:
1. Similar process as normal design task, but refer to 'UI design & implementation guidelines' for guidelines

## When asked to update or iterate design:
1. Don't edit the existing design, just create a new html file with the same name but with _n.html appended to the end, e.g. if we are iterating ui_1.html, then each version should be ui_1_1.html, ui_1_2.html, etc.

## When asked to design logo or icon:
1. Copy/duplicate existing svg file but name it based on our naming convention in design_ierations folder, and then make edits to the copied svg file (So we can avoid lots of mistakes), like 'original_filename.svg superdesign/design-iterations/new_filename.svg'
2. Very important sub agent copy first, and Each agent just copy & edit a single svg file with svg code
3. you should focus on the the correctness of the svg code

## When asked to design a component:
1. Similar process as normal design task, and each agent just create a single html page with component inside;
2. Focus just on just one component itself, and don't add any other elements or text
3. Each HTML just have one component with mock data inside

## When asked to design wireframes:
1. Focus on minimal line style black and white wireframes, no colors, and never include any images, just try to use css to make some placeholder images. (Don't use service like placehold.co too, we can't render it)
2. Don't add any annotation of styles, just basic wireframes like Balsamiq style
3. Focus on building out the flow of the wireframes

# When asked to extract design system from images:
Your goal is to extract a generalized and reusable design system from the screenshots provided, **without including specific image content**, so that frontend developers or AI agents can reference the JSON as a style foundation for building consistent UIs.

1. Analyze the screenshots provided:
   * Color palette
   * Typography rules
   * Spacing guidelines
   * Layout structure (grids, cards, containers, etc.)
   * UI components (buttons, inputs, tables, etc.)
   * Border radius, shadows, and other visual styling patterns
2. Create a design-system.json file in 'design_system' folder that clearly defines these rules and can be used to replicate the visual language in a consistent way.
3. if design-system.json already exist, then create a new file with the name design-system_{n}.json (Where n needs to be unique like design-system_1.json, design-system_2.json, etc.)

**Constraints**

* Do **not** extract specific content from the screenshots (no text, logos, icons).
* Focus purely on *design principles*, *structure*, and *styles*.

--------

# UI design & implementation guidelines:

## Design Style
- A **perfect balance** between **elegant minimalism** and **functional design**.
- **Soft, refreshing gradient colors** that seamlessly integrate with the brand palette.
- **Well-proportioned white space** for a clean layout.
- **Light and immersive** user experience.
- **Clear information hierarchy** using **subtle shadows and modular card layouts**.
- **Natural focus on core functionalities**.
- **Refined rounded corners**.
- **Delicate micro-interactions**.
- **Comfortable visual proportions**.
- **Responsive design** You only output responsive design, it needs to look perfect on both mobile, tablet and desktop.
    - If its a mobile app, also make sure you have responsive design OR make the center the mobile UI

## Technical Specifications
1. **Images**: do NEVER include any images, we can't render images in webview,just try to use css to make some placeholder images. (Don't use service like placehold.co too, we can't render it)
2. **Styles**: Use **Tailwind CSS** via **CDN** for styling. (Use !important declarations for critical design tokens that must not be overridden, Load order management - ensure custom styles load after framework CSS, CSS-in-JS or scoped styles to avoid global conflicts, Use utility-first approach - define styles using Tailwind classes instead of custom CSS when possible)
3. **Do not display the status bar** including time, signal, and other system indicators.
4. **All text should be only black or white**.
5. Choose a **4 pt or 8 pt spacing system**—all margins, padding, line-heights, and element sizes must be exact multiples.
6. Use **consistent spacing tokens** (e.g., 4, 8, 16, 24, 32px) — never arbitrary values like 5 px or 13 px.
7. Apply **visual grouping** ("spacing friendship"): tighter gaps (4–8px) for related items, larger gaps (16–24px) for distinct groups.
8. Ensure **typographic rhythm**: font‑sizes, line‑heights, and spacing aligned to the grid (e.g., 16 px text with 24 px line-height).
9. Maintain **touch-area accessibility**: buttons and controls should meet or exceed 48×48 px, padded using grid units.

## 🎨 Color Style
* Use a **minimal palette**: default to **black, white, and neutrals**—no flashy gradients or mismatched hues .
* Follow a **60‑30‑10 ratio**: ~60% background (white/light gray), ~30% surface (white/medium gray), ~10% accents (charcoal/black) .
* Accent colors limited to **one subtle tint** (e.g., charcoal black or very soft beige). Interactive elements like links or buttons use this tone sparingly.
* Always check **contrast** for text vs background via WCAG (≥4.5:1)

## ✍️ Typography & Hierarchy

### 1. 🎯 Hierarchy Levels & Structure
* Always define at least **three typographic levels**: **Heading (H1)**, **Subheading (H2)**, and **Body**.
* Use **size, weight, color**, and **spacing** to create clear differences between them.
* H1 should stand out clearly (largest & boldest), H2 should be distinctly smaller/medium-weight, and body remains readable and lighter.

### 2. 📏 Size & Scale
* Follow a modular scale: e.g., **H1: 36px**, **H2: 28px**, **Body: 16px** (min). Adjust for mobile if needed .
* Maintain strong contrast—don't use size differences of only 2px; aim for at least **6–8px difference** between levels .

### 3. 🧠 Weight, Style & Color
* Use **bold or medium weight** for headings, **regular** for body.
* Utilize **color contrast** (e.g., darker headings, neutral body) to support hierarchy.
* Avoid excessive styles like italics or uppercase—unless used sparingly for emphasis or subheadings.

### 4. ✂️ Spacing & Rhythm
* Add **0.8×–1.5× line-height** for body and headings to improve legibility.
* Use consistent **margin spacing above/below headings** (e.g., margin-top: 1.2× line-height) .
`;
// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "superdesign_generate",
                description: "Returns design specifications for Claude Code to generate UI designs, wireframes, components, logos, or icons",
                inputSchema: {
                    type: "object",
                    properties: {
                        prompt: { type: "string", description: "Design prompt describing what to create" },
                        design_type: {
                            type: "string",
                            enum: ["ui", "wireframe", "component", "logo", "icon"],
                            description: "Type of design to generate"
                        },
                        variations: {
                            type: "number",
                            minimum: 1,
                            maximum: 5,
                            default: 3,
                            description: "Number of design variations to create"
                        },
                        framework: {
                            type: "string",
                            enum: ["html", "react", "vue"],
                            default: "html",
                            description: "Framework for UI components"
                        }
                    },
                    required: ["prompt", "design_type"],
                },
            },
            {
                name: "superdesign_iterate",
                description: "Returns iteration instructions based on existing design and feedback",
                inputSchema: {
                    type: "object",
                    properties: {
                        design_file: { type: "string", description: "Path to existing design file to iterate on" },
                        feedback: { type: "string", description: "Feedback for improving the design" },
                        variations: {
                            type: "number",
                            minimum: 1,
                            maximum: 5,
                            default: 3,
                            description: "Number of design variations to create"
                        }
                    },
                    required: ["design_file", "feedback"],
                },
            },
            {
                name: "superdesign_extract_system",
                description: "Returns instructions for extracting design system from screenshot or image",
                inputSchema: {
                    type: "object",
                    properties: {
                        image_path: { type: "string", description: "Path to screenshot/image to extract design system from" }
                    },
                    required: ["image_path"],
                },
            },
            {
                name: "superdesign_list",
                description: "List all created designs in the workspace",
                inputSchema: {
                    type: "object",
                    properties: {
                        workspace_path: { type: "string", description: "Workspace path (defaults to current directory)" }
                    },
                },
            },
        ],
    };
});
// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        switch (name) {
            case "superdesign_generate": {
                const { prompt, design_type, variations, framework } = GenerateDesignSchema.parse(args);
                const superdesignDir = getSuperdeignDirectory();
                const designIterationsDir = path.join(superdesignDir, 'design_iterations');
                const baseName = generateBaseName(prompt);
                const extension = (design_type === 'logo' || design_type === 'icon') ? 'svg' : 'html';
                // Create file list for variations
                const fileList = [];
                for (let i = 1; i <= variations; i++) {
                    fileList.push(`${baseName}_${i}.${extension}`);
                }
                // Build design specifications
                let specifications = `DESIGN SPECIFICATION FOR CLAUDE CODE:

IMPORTANT: You must generate and save the following design files based on these specifications.

=== DESIGN PARAMETERS ===
- Type: ${design_type}
- Prompt: ${prompt}
- Framework: ${framework}
- Files to create: ${variations} variations
- File format: ${extension.toUpperCase()}

=== FILES TO CREATE ===
${fileList.map((file, index) => `${index + 1}. ${path.join(designIterationsDir, file)}`).join('\n')}

=== DESIGN GUIDELINES ===
${design_type === 'wireframe' ? '- Create minimal black and white wireframes with no colors\n- Use simple line styles like Balsamiq\n- No annotations or decorative elements' : ''}
${design_type === 'component' ? `- Generate a single ${framework} component with mock data\n- Focus only on the component itself\n- Include proper component structure for ${framework}` : ''}
${design_type === 'logo' || design_type === 'icon' ? '- Create proper SVG code with vector graphics\n- Ensure SVG is valid and well-structured\n- Focus on clean, scalable design' : ''}
${design_type === 'ui' ? '- Create complete responsive HTML interface\n- Use Tailwind CSS via CDN\n- Follow all UI design guidelines below' : ''}

=== SUPERDESIGN SYSTEM PROMPT ===
${SUPERDESIGN_SYSTEM_PROMPT}

=== EXECUTION INSTRUCTIONS ===
1. Create the superdesign/design_iterations directory if it doesn't exist
2. Generate ${variations} unique variations of the ${design_type} based on the prompt: "${prompt}"
3. Save each variation with the exact filenames listed above
4. Each variation should be different but follow the same design brief
5. Follow all Superdesign guidelines and constraints

Please proceed to create these ${variations} design files now.`;
                return {
                    content: [{ type: "text", text: specifications }],
                };
            }
            case "superdesign_iterate": {
                const { design_file, feedback, variations } = IterateDesignSchema.parse(args);
                if (!existsSync(design_file)) {
                    return {
                        content: [{ type: "text", text: `Error: Design file ${design_file} does not exist` }],
                    };
                }
                const originalContent = readFileSync(design_file, 'utf8');
                const superdesignDir = getSuperdeignDirectory();
                const designIterationsDir = path.join(superdesignDir, 'design_iterations');
                const baseName = path.basename(design_file, path.extname(design_file));
                const extension = path.extname(design_file).substring(1);
                // Create file list for iterations
                const fileList = [];
                for (let i = 1; i <= variations; i++) {
                    fileList.push(`${baseName}_${i}.${extension}`);
                }
                let specifications = `DESIGN ITERATION SPECIFICATION FOR CLAUDE CODE:

IMPORTANT: You must iterate on the existing design and save the improved versions.

=== ITERATION PARAMETERS ===
- Original file: ${design_file}
- Feedback: ${feedback}
- Files to create: ${variations} improved variations
- File format: ${extension.toUpperCase()}

=== FILES TO CREATE ===
${fileList.map((file, index) => `${index + 1}. ${path.join(designIterationsDir, file)}`).join('\n')}

=== ORIGINAL DESIGN ===
${originalContent}

=== ITERATION GUIDELINES ===
1. Analyze the original design above
2. Apply the following feedback: ${feedback}
3. Create ${variations} different improvements based on the feedback
4. Each variation should interpret the feedback slightly differently
5. Maintain the core structure while implementing improvements
6. Follow all Superdesign guidelines

=== SUPERDESIGN SYSTEM PROMPT ===
${SUPERDESIGN_SYSTEM_PROMPT}

=== EXECUTION INSTRUCTIONS ===
1. Read and understand the original design
2. Generate ${variations} improved variations based on the feedback
3. Save each variation with the exact filenames listed above
4. Ensure each iteration is an improvement while maintaining design consistency

Please proceed to create these ${variations} improved design files now.`;
                return {
                    content: [{ type: "text", text: specifications }],
                };
            }
            case "superdesign_extract_system": {
                const { image_path } = ExtractDesignSystemSchema.parse(args);
                if (!existsSync(image_path)) {
                    return {
                        content: [{ type: "text", text: `Error: Image file ${image_path} does not exist` }],
                    };
                }
                const superdesignDir = getSuperdeignDirectory();
                const designSystemDir = path.join(superdesignDir, 'design_system');
                let specifications = `DESIGN SYSTEM EXTRACTION SPECIFICATION FOR CLAUDE CODE:

IMPORTANT: You must analyze the image and extract a design system JSON file.

=== EXTRACTION PARAMETERS ===
- Image path: ${image_path}
- Output location: ${designSystemDir}/design-system.json

=== EXTRACTION GUIDELINES ===
Analyze the screenshot/image and extract:
1. Color palette (primary, secondary, neutrals)
2. Typography rules (font families, sizes, weights, line heights)
3. Spacing system (margin/padding values)
4. Layout structure (grid system, containers)
5. Component styles (buttons, inputs, cards, etc.)
6. Visual effects (shadows, borders, radius values)

=== OUTPUT FORMAT ===
Create a JSON file with this structure:
{
  "colors": {
    "primary": {...},
    "secondary": {...},
    "neutrals": {...}
  },
  "typography": {
    "fontFamilies": {...},
    "sizes": {...},
    "weights": {...}
  },
  "spacing": {...},
  "components": {
    "buttons": {...},
    "inputs": {...},
    ...
  },
  "effects": {...}
}

=== EXECUTION INSTRUCTIONS ===
1. Analyze the image at ${image_path}
2. Extract ONLY design patterns, not content
3. Create a reusable design system
4. Save as ${designSystemDir}/design-system.json
5. If file exists, create design-system_2.json, etc.

Please proceed to analyze the image and create the design system JSON file now.`;
                return {
                    content: [{ type: "text", text: specifications }],
                };
            }
            case "superdesign_list": {
                const { workspace_path } = ListDesignsSchema.parse(args);
                try {
                    const superdesignDir = getSuperdeignDirectory(workspace_path);
                    const designIterationsDir = path.join(superdesignDir, 'design_iterations');
                    const designSystemDir = path.join(superdesignDir, 'design_system');
                    const designFiles = await glob('*.{html,svg}', { cwd: designIterationsDir });
                    const systemFiles = await glob('*.json', { cwd: designSystemDir });
                    let result = `Superdesign workspace: ${superdesignDir}\n\n`;
                    if (designFiles.length > 0) {
                        result += `Design iterations (${designFiles.length}):\n`;
                        designFiles.forEach(file => {
                            result += `  - ${file}\n`;
                        });
                    }
                    else {
                        result += "No design iterations found.\n";
                    }
                    result += "\n";
                    if (systemFiles.length > 0) {
                        result += `Design systems (${systemFiles.length}):\n`;
                        systemFiles.forEach(file => {
                            result += `  - ${file}\n`;
                        });
                    }
                    else {
                        result += "No design systems found.\n";
                    }
                    return {
                        content: [{ type: "text", text: result }],
                    };
                }
                catch (error) {
                    return {
                        content: [{ type: "text", text: `Error listing designs: ${error.message}` }],
                    };
                }
            }
            default:
                return {
                    content: [{ type: "text", text: `Unknown tool: ${name}` }],
                };
        }
    }
    catch (error) {
        return {
            content: [{ type: "text", text: `Error parsing arguments: ${error.message}` }],
        };
    }
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}
main().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});

---
title: Figma MCP Preparation
type: process
tags: [figma, mcp, design-tokens]
---

# Figma MCP Preparation

To prepare for Figma MCP (Model Context Protocol) integration:

## 1. Design Tokens

- Document/export all Tailwind/PrimeVue tokens for Figma mapping.
- Ensure all design tokens (colors, spacing, typography) are defined in a way that can be mapped to Figma variables.
- Tailwind + PrimeVue tokens should be documented and, if possible, exported for Figma.

## 2. Component Mapping

- Map Volt/PrimeVue components to Figma components. Document custom variants.
- Maintain a mapping between Volt/PrimeVue components and Figma components.
- Document any custom components or variants that need to be represented in Figma.

## 3. Figma File Structure

- One page per domain module, components/variants matching Volt, styles/tokens matching code.
- Prepare a Figma file with:
  - A page for each domain module (Auth, Customer, etc.)
  - Components and variants matching your Volt components
  - Styles and tokens matching your Tailwind/PrimeVue setup

## 4. MCP Readiness

- Document props/slots/states for MCP. Organize Figma for easy token/component extraction.
- Document component props, slots, and states in a way that can be consumed by MCP.
- Ensure your design system in Figma is organized for easy token and component extraction.

## 5. Sync Process

- Plan workflow to keep Figma and code in sync (manual or automated).
- Plan for a workflow to keep Figma and code in sync (manual or automated via plugins/scripts).

---
name: media
description: "Audit media library organization in Sitecore XM Cloud: storage, folder structure, naming conventions, and upload practices. Trigger phrases: media audit, media library review, image organization, media naming."
category: project-review
---

# Media

Use this skill to audit media library organization in a Sitecore XM Cloud SXA Headless project.

## Checks

### Media is stored in the database
**Severity:** Minor
**What to verify:** In XMC, media is stored in the Sitecore database and served via Experience Edge CDN. There is no filesystem-based media storage option. Verify that media is properly uploaded to the media library, not referenced via external URLs hard-coded in content.
**Issue indicators:** Images referenced via hard-coded external URLs instead of media library items, missing media items.
**Recommendation:** Upload all media to the Sitecore media library. Reference media via media library fields. This ensures Edge CDN delivery and proper image resizing.

### Folder structure
**Severity:** Minor
**What to verify:** Media is organized in a logical folder hierarchy under `/sitecore/media library/Project/<site>/`. Sub-folders group media by type or purpose.
**Issue indicators:** Flat media folder with hundreds of items, no logical grouping, media from different sites mixed together.
**Recommendation:** Create sub-folders by category: `Heroes/`, `Products/`, `Team/`, `Icons/`, `Documents/`. Separate media per site in multi-site setups.

### Naming conventions
**Severity:** Minor
**What to verify:** Media items have descriptive, consistent names that help editors find and identify assets.
**Issue indicators:** Files with auto-generated names ("IMG_2847.jpg", "Screenshot 2024-01-15"), inconsistent naming patterns.
**Recommendation:** Establish a naming convention (e.g., lowercase-with-hyphens, descriptive-of-content). Rename uploads to match the convention before or after upload.

### Drag and drop
**Severity:** Minor
**What to verify:** The drag-and-drop upload experience works correctly — uploaded files land in the intended folder with proper names and metadata.
**Issue indicators:** Files uploaded to wrong locations via drag-and-drop, missing alt text on uploaded images, files exceeding size limits without warning.
**Recommendation:** Configure upload defaults (target folder, max size). Train editors on proper upload workflows. Set up media item validators for required fields like alt text.

## References

- https://doc.sitecore.com/xmc/en/developers/xm-cloud/media-library.html

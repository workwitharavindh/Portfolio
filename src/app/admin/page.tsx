"use client";
import React, { useState, useEffect } from "react";

// ─── Auth ────────────────────────────────────────────────────────────────────
const VALID_USER = "aravindhan";
const VALID_PASS = "aravi@2001";

// ─── Styles ──────────────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  background: "transparent",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#fff",
  fontSize: 13,
  padding: "0.85rem 1rem",
  outline: "none",
  fontFamily: "Inter,sans-serif",
  transition: "border-color 0.2s",
  width: "100%",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "Space Mono,monospace",
  fontSize: 9,
  letterSpacing: "0.35em",
  color: "rgba(240,240,240,0.45)",
  textTransform: "uppercase",
};

const fieldStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
};

const sectionHeadingStyle: React.CSSProperties = {
  fontFamily: "Space Mono,monospace",
  fontSize: 10,
  letterSpacing: "0.35em",
  color: "#e63946",
  textTransform: "uppercase",
  marginBottom: "1.5rem",
  borderBottom: "1px solid rgba(255,255,255,0.07)",
  paddingBottom: "0.75rem",
};

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (userId === VALID_USER && password === VALID_PASS) {
        onLogin();
      } else {
        setError("Invalid credentials. Please try again.");
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0a",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Inter,sans-serif",
    }}>
      <div style={{ width: "100%", maxWidth: 400, padding: "2.5rem" }}>
        <div style={{ marginBottom: "3rem", textAlign: "center" }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#e63946", margin: "0 auto 1rem" }} />
          <div style={{ fontFamily: "Space Mono,monospace", fontSize: 18, letterSpacing: "0.35em", color: "#fff", textTransform: "uppercase" }}>
            ARAVINDHAN R
          </div>
          <div style={{ fontFamily: "Space Mono,monospace", fontSize: 9, letterSpacing: "0.3em", color: "rgba(240,240,240,0.3)", textTransform: "uppercase", marginTop: "0.5rem" }}>
            Admin · Secure Login
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div style={fieldStyle}>
            <label style={labelStyle}>User ID</label>
            <input type="text" value={userId} onChange={e => setUserId(e.target.value)}
              placeholder="Enter user ID" required autoComplete="username" style={inputStyle}
              onFocus={e => (e.target.style.borderColor = "#e63946")}
              onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Enter password" required autoComplete="current-password" style={inputStyle}
              onFocus={e => (e.target.style.borderColor = "#e63946")}
              onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
          </div>

          {error && (
            <div style={{ padding: "0.75rem 1rem", background: "#e6394615", border: "1px solid #e6394640", fontFamily: "Space Mono,monospace", fontSize: 10, color: "#e63946", letterSpacing: "0.15em" }}>
              ✕ {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            style={{ padding: "1rem", background: loading ? "rgba(230,57,70,0.5)" : "#e63946", color: "#fff", border: "none", fontFamily: "Space Mono,monospace", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer", transition: "background 0.2s", marginTop: "0.5rem" }}
            onMouseEnter={e => !loading && (e.currentTarget.style.background = "#c1121f")}
            onMouseLeave={e => !loading && (e.currentTarget.style.background = "#e63946")}>
            {loading ? "Authenticating..." : "Login →"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Main Admin Panel ─────────────────────────────────────────────────────────
interface ProjectEntry {
  id?: string;
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  category: string;
  subcategory?: string;
  layout?: "Horizontal" | "Vertical";
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  // Settings state
  const [aboutImageUrl, setAboutImageUrl] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [selectedParentCategory, setSelectedParentCategory] = useState("");
  const [newSubcategory, setNewSubcategory] = useState("");
  const [subcategories, setSubcategories] = useState<{ category: string; name: string }[]>([]);
  const [projects, setProjects] = useState<ProjectEntry[]>([]);

  // Project list filter states
  const [filterText, setFilterText] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterSubcategory, setFilterSubcategory] = useState("All");

  const filteredProjects = React.useMemo(() => {
    return projects
      .map((proj, index) => ({ proj, index }))
      .filter(({ proj }) => {
        if (filterCategory !== "All" && proj.category?.toLowerCase() !== filterCategory.toLowerCase()) return false;
        if (filterSubcategory !== "All" && proj.subcategory?.toLowerCase() !== filterSubcategory.toLowerCase()) return false;
        if (filterText && !proj.title?.toLowerCase().includes(filterText.toLowerCase())) return false;
        return true;
      });
  }, [projects, filterCategory, filterSubcategory, filterText]);

  // Layout Organizer states and handlers
  const [replicaActiveCategory, setReplicaActiveCategory] = useState("All");
  const [replicaActiveSubcategory, setReplicaActiveSubcategory] = useState("All");
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const replicaFallbackCategories = React.useMemo(() => [
    "Featured Work",
    "Commercial Projects",
    "Viral Content",
    "YouTube Content",
    "Reels",
    "Color Grading"
  ], []);

  const replicaDisplayCategories = React.useMemo(() => {
    const catsSet = new Set<string>();
    const baseCats = categories.length > 0 ? categories : replicaFallbackCategories;
    baseCats.forEach(cat => {
      if (cat && cat.trim()) catsSet.add(cat.trim());
    });
    // Add any category from items to make sure all items are filterable
    projects.forEach(item => {
      if (item.category && item.category.trim()) {
        const trimmed = item.category.trim();
        const existing = Array.from(catsSet).find(c => c.toLowerCase() === trimmed.toLowerCase());
        if (!existing) catsSet.add(trimmed);
      }
    });
    return ["All", ...Array.from(catsSet)];
  }, [categories, replicaFallbackCategories, projects]);

  const replicaActiveSubcategories = React.useMemo(() => {
    if (replicaActiveCategory === "All") return [];
    return subcategories.filter(
      sub => sub.category?.trim().toLowerCase() === replicaActiveCategory.trim().toLowerCase()
    );
  }, [subcategories, replicaActiveCategory]);

  const replicaUniqueItems = React.useMemo(() => {
    const seenUrls = new Set<string>();
    return projects.filter(item => {
      const videoUrlStr = String(item.videoUrl || "").trim();
      if (videoUrlStr && seenUrls.has(videoUrlStr)) return false;
      if (videoUrlStr) seenUrls.add(videoUrlStr);
      return true;
    });
  }, [projects]);

  const replicaFilteredItems = React.useMemo(() => {
    return replicaUniqueItems.filter(item => {
      if (replicaActiveCategory !== "All") {
        const catMatch = item.category?.trim().toLowerCase() === replicaActiveCategory.trim().toLowerCase();
        if (!catMatch) return false;
      }
      if (replicaActiveSubcategory !== "All") {
        const subMatch = item.subcategory?.trim().toLowerCase() === replicaActiveSubcategory.trim().toLowerCase();
        if (!subMatch) return false;
      }
      return true;
    });
  }, [replicaUniqueItems, replicaActiveCategory, replicaActiveSubcategory]);

  const handleDragStart = (e: React.DragEvent, item: ProjectEntry) => {
    const idxInMain = projects.findIndex(p => p.id === item.id);
    setDraggedIdx(idxInMain);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetItem: ProjectEntry) => {
    e.preventDefault();
    if (draggedIdx === null) return;

    const targetIdxInMain = projects.findIndex(p => p.id === targetItem.id);
    if (targetIdxInMain === -1 || targetIdxInMain === draggedIdx) return;

    const reordered = [...projects];
    const [draggedItem] = reordered.splice(draggedIdx, 1);
    reordered.splice(targetIdxInMain, 0, draggedItem);

    setProjects(reordered);
    setDraggedIdx(null);
  };

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  // Load existing config when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    setLoading(true);
    fetch("/api/config")
      .then(r => r.json())
      .then(data => {
        setAboutImageUrl(data.aboutImageUrl ?? "");
        const cd = data.contactDetails ?? {};
        setEmail(cd.email ?? "");
        setWhatsapp(cd.whatsapp ?? "");
        setInstagram(cd.instagram ?? "");
        setLinkedin(cd.linkedin ?? "");

        const fetchedCats = data.categories ?? [
          "Featured Work",
          "Wedding Films",
          "Commercial Projects",
          "Viral Content",
          "YouTube Content",
          "Reels",
          "Color Grading"
        ];
        setCategories(fetchedCats);
        if (fetchedCats.length > 0) {
          setSelectedParentCategory(fetchedCats[0]);
        }

        const fetchedSubcats = data.subcategories ?? [];
        setSubcategories(fetchedSubcats);

        const items = data.portfolioItems ?? [];
        const mapped: ProjectEntry[] = items.length > 0
          ? items.map((item: any, i: number) => ({
              id: item?.id ?? `item-${Date.now()}-${i}`,
              title: item?.title ?? `Project ${i + 1}`,
              videoUrl: item?.videoUrl ?? item?.rawUrl ?? "",
              thumbnailUrl: item?.thumbnailUrl ?? "",
              category: item?.category ?? (fetchedCats[0] || "Featured Work"),
              subcategory: item?.subcategory ?? "",
              layout: item?.layout ?? "Horizontal",
            }))
          : Array.from({ length: 5 }, (_, i) => ({
              id: `item-${Date.now()}-${i}`,
              title: `Project ${i + 1}`,
              videoUrl: "",
              thumbnailUrl: "",
              category: fetchedCats[0] || "Featured Work",
              subcategory: "",
              layout: "Horizontal",
            }));
        setProjects(mapped);
      })
      .catch(() => showToast("Failed to load settings", false))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Build the full payload
      const existingRes = await fetch("/api/config");
      const existing = await existingRes.json();

      const portfolioItems = projects.map((p, i) => {
        const existingItem = existing.portfolioItems?.find((item: any) => item.id === p.id) 
          || existing.portfolioItems?.[i];
        
        return {
          ...existingItem,
          id: p.id || existingItem?.id || `item-${Date.now()}-${i}`,
          title: p.title || `Project ${i + 1}`,
          category: p.category || (categories[0] || "Featured Work"),
          subcategory: p.subcategory || "",
          videoUrl: p.videoUrl || "",
          thumbnailUrl: p.thumbnailUrl || "",
          layout: p.layout || "Horizontal",
          isFeatured: existingItem?.isFeatured ?? false,
          description: existingItem?.description ?? "",
        };
      });

      const payload = {
        ...existing,
        aboutImageUrl,
        contactDetails: { email, whatsapp, instagram, linkedin, youtube: existing.contactDetails?.youtube ?? "" },
        portfolioItems,
        categories,
        subcategories,
      };

      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Save failed");
      showToast("Settings saved successfully!", true);
    } catch {
      showToast("Failed to save — try again", false);
    } finally {
      setSaving(false);
    }
  };

  const updateProject = (idx: number, field: keyof ProjectEntry, value: string) => {
    setProjects(prev => prev.map((p, i) => i === idx ? { ...p, [field]: value } : p));
  };

  const handleAddCategory = () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    if (categories.includes(trimmed)) {
      showToast("Category already exists", false);
      return;
    }
    setCategories(prev => [...prev, trimmed]);
    if (!selectedParentCategory) {
      setSelectedParentCategory(trimmed);
    }
    setNewCategory("");
    showToast(`Added category: ${trimmed}`, true);
  };

  const handleDeleteCategory = (catToDelete: string) => {
    setCategories(prev => prev.filter(c => c !== catToDelete));
    setSubcategories(prev => prev.filter(s => s.category !== catToDelete));
    if (selectedParentCategory === catToDelete) {
      const remaining = categories.filter(c => c !== catToDelete);
      setSelectedParentCategory(remaining[0] || "");
    }
    showToast(`Deleted category: ${catToDelete}`, true);
  };

  const handleAddSubcategory = () => {
    const trimmed = newSubcategory.trim();
    if (!trimmed) return;
    if (!selectedParentCategory) {
      showToast("Select a parent category first", false);
      return;
    }
    const exists = subcategories.some(
      sub => sub.category.toLowerCase() === selectedParentCategory.toLowerCase() && sub.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) {
      showToast("Subcategory already exists for this category", false);
      return;
    }
    setSubcategories(prev => [...prev, { category: selectedParentCategory, name: trimmed }]);
    setNewSubcategory("");
    showToast(`Added subcategory: ${trimmed} to ${selectedParentCategory}`, true);
  };

  const handleDeleteSubcategory = (cat: string, nameToDelete: string) => {
    setSubcategories(prev => prev.filter(sub => !(sub.category === cat && sub.name === nameToDelete)));
    showToast(`Deleted subcategory: ${nameToDelete}`, true);
  };

  const handleAddProject = () => {
    setProjects(prev => [...prev, {
      id: `item-${Date.now()}`,
      title: "",
      videoUrl: "",
      thumbnailUrl: "",
      category: categories[0] || "Featured Work",
      subcategory: "",
      layout: "Horizontal"
    }]);
    showToast("Added new video fields", true);
  };

  const handleDeleteProject = (idxToDelete: number) => {
    setProjects(prev => prev.filter((_, idx) => idx !== idxToDelete));
    showToast("Removed video fields", true);
  };

  if (!isAuthenticated) return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#f0f0f0", fontFamily: "Inter,sans-serif" }}>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, padding: "12px 20px", background: toast.ok ? "#16a34a" : "#e63946", fontFamily: "Space Mono,monospace", fontSize: 11, letterSpacing: "0.2em", color: "#fff", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
          {toast.ok ? "✓" : "✕"} {toast.msg}
        </div>
      )}

      {/* Header */}
      <header style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "1.5rem 2.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#e63946" }} />
          <span style={{ fontFamily: "Space Mono,monospace", fontSize: 16, letterSpacing: "0.25em", color: "#fff" }}>ARAVINDHAN R</span>
          <span style={{ fontFamily: "Space Mono,monospace", fontSize: 9, color: "rgba(240,240,240,0.35)", letterSpacing: "0.3em", textTransform: "uppercase", marginLeft: 8 }}>Admin Panel</span>
        </div>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <a href="/" style={{ fontFamily: "Space Mono,monospace", fontSize: 9, color: "rgba(240,240,240,0.4)", letterSpacing: "0.3em", textTransform: "uppercase", textDecoration: "none" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#e63946")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(240,240,240,0.4)")}>
            ← View Site
          </a>
          <button onClick={() => setIsAuthenticated(false)} style={{ fontFamily: "Space Mono,monospace", fontSize: 9, color: "rgba(240,240,240,0.4)", letterSpacing: "0.3em", textTransform: "uppercase", background: "none", border: "none", cursor: "pointer" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#e63946")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(240,240,240,0.4)")}>
            Logout
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "3rem 2.5rem" }}>

        {/* Page Title */}
        <div style={{ marginBottom: "3rem" }}>
          <h1 style={{ fontFamily: "Space Mono,monospace", fontSize: 12, letterSpacing: "0.4em", color: "rgba(240,240,240,0.35)", textTransform: "uppercase", margin: 0 }}>
            Site Settings
          </h1>
          <p style={{ fontFamily: "Space Mono,monospace", fontSize: 9, color: "rgba(240,240,240,0.2)", letterSpacing: "0.25em", textTransform: "uppercase", marginTop: "0.5rem" }}>
            Changes are saved to Google Sheets and reflected on the live site.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", fontFamily: "Space Mono,monospace", fontSize: 10, color: "rgba(240,240,240,0.3)", letterSpacing: "0.3em", textTransform: "uppercase" }}>
            Loading configuration...
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "3.5rem" }}>

            {/* ── Profile Image ─────────────────────────────────────────────── */}
            <section>
              <h2 style={sectionHeadingStyle}>Profile / About Image</h2>
              <div style={fieldStyle}>
                <label style={labelStyle}>Google Drive Image Link</label>
                <input type="url" value={aboutImageUrl} onChange={e => setAboutImageUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/..."
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = "#e63946")}
                  onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
                <span style={{ fontFamily: "Space Mono,monospace", fontSize: 8, color: "rgba(240,240,240,0.25)", letterSpacing: "0.2em" }}>
                  Paste a Google Drive shareable link. The image will appear in the About section on the right side.
                </span>
              </div>
            </section>

            {/* ── Manage Categories ────────────────────────────────────────── */}
            <section>
              <h2 style={sectionHeadingStyle}>Manage Video Categories</h2>
              <div style={{ ...fieldStyle, marginBottom: "1.5rem" }}>
                <label style={labelStyle}>Add New Category</label>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    placeholder="e.g. Wedding Films"
                    style={{ ...inputStyle, flex: 1 }}
                    onFocus={e => (e.target.style.borderColor = "#e63946")}
                    onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCategory();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    style={{
                      padding: "0 1.5rem",
                      background: "#e63946",
                      color: "#fff",
                      border: "none",
                      fontFamily: "Space Mono,monospace",
                      fontSize: 10,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      cursor: "pointer"
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>

              <div style={{ ...fieldStyle }}>
                <label style={labelStyle}>Current Categories</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.5rem" }}>
                  {categories.map(c => (
                    <div
                      key={c}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.5rem 0.75rem",
                        border: "1px solid rgba(255,255,255,0.1)",
                        background: "rgba(255,255,255,0.02)",
                        borderRadius: "2px",
                        fontSize: 12,
                        fontFamily: "Inter,sans-serif",
                        color: "#fff"
                      }}
                    >
                      <span>{c}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(c)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "rgba(255,255,255,0.4)",
                          cursor: "pointer",
                          fontSize: 12,
                          padding: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#e63946")}
                        onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {categories.length === 0 && (
                    <span style={{ fontFamily: "Space Mono,monospace", fontSize: 9, color: "rgba(240,240,240,0.25)", letterSpacing: "0.2em" }}>
                      No categories created yet. Click "Add" above to create one.
                    </span>
                  )}
                </div>
              </div>
            </section>

            {/* ── Manage Subcategories ───────────────────────────────────────── */}
            <section>
              <h2 style={sectionHeadingStyle}>Manage Video Subcategories</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Select Parent Category</label>
                  <select
                    value={selectedParentCategory}
                    onChange={e => setSelectedParentCategory(e.target.value)}
                    style={{ ...inputStyle, background: "#0a0a0a", cursor: "pointer" }}
                    onFocus={e => (e.target.style.borderColor = "#e63946")}
                    onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Add New Subcategory</label>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <input
                      type="text"
                      value={newSubcategory}
                      onChange={e => setNewSubcategory(e.target.value)}
                      placeholder="e.g. Food, Fashion"
                      style={{ ...inputStyle, flex: 1 }}
                      onFocus={e => (e.target.style.borderColor = "#e63946")}
                      onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddSubcategory();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddSubcategory}
                      style={{
                        padding: "0 1.5rem",
                        background: "#e63946",
                        color: "#fff",
                        border: "none",
                        fontFamily: "Space Mono,monospace",
                        fontSize: 10,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        cursor: "pointer"
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ ...fieldStyle }}>
                <label style={labelStyle}>Current Subcategories</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "0.5rem" }}>
                  {categories.map(cat => {
                    const subs = subcategories.filter(sub => sub.category.toLowerCase() === cat.toLowerCase());
                    if (subs.length === 0) return null;
                    return (
                      <div key={cat} style={{ border: "1px solid rgba(255,255,255,0.05)", padding: "1rem", background: "rgba(255,255,255,0.01)" }}>
                        <span style={{ fontFamily: "Space Mono,monospace", fontSize: 9, color: "var(--primary)", letterSpacing: "0.2em", textTransform: "uppercase" }}>{cat}</span>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.5rem" }}>
                          {subs.map(s => (
                            <div
                              key={s.name}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                padding: "0.4rem 0.6rem",
                                border: "1px solid rgba(255,255,255,0.1)",
                                background: "rgba(255,255,255,0.02)",
                                borderRadius: "2px",
                                fontSize: 11,
                                fontFamily: "Inter,sans-serif",
                                color: "#fff"
                              }}
                            >
                              <span>{s.name}</span>
                              <button
                                type="button"
                                onClick={() => handleDeleteSubcategory(s.category, s.name)}
                                style={{
                                  background: "none",
                                  border: "none",
                                  color: "rgba(255,255,255,0.4)",
                                  cursor: "pointer",
                                  fontSize: 11,
                                  padding: 0,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center"
                                }}
                                onMouseEnter={e => (e.currentTarget.style.color = "#e63946")}
                                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  {subcategories.length === 0 && (
                    <span style={{ fontFamily: "Space Mono,monospace", fontSize: 9, color: "rgba(240,240,240,0.25)", letterSpacing: "0.2em" }}>
                      No subcategories created yet. Add one above.
                    </span>
                  )}
                </div>
              </div>
            </section>

            {/* ── Cinematic Layout Organizer (Drag & Drop) ─────────────────── */}
            <section style={{ border: "1px dashed rgba(230,57,70,0.3)", padding: "2rem", background: "rgba(230,57,70,0.02)", position: "relative" }}>
              <h2 style={sectionHeadingStyle}>Cinematic Layout Organizer (Drag & Drop)</h2>
              <p style={{ fontFamily: "Space Mono,monospace", fontSize: 9, color: "rgba(240,240,240,0.35)", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: "-0.5rem", marginBottom: "2rem" }}>
                Drag and move the tiles to rearrange projects. Dragging updates the save order automatically.
              </p>

              {/* Replica Categories Bar */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "1rem" }}>
                {replicaDisplayCategories.map((cat) => {
                  const isActive = replicaActiveCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setReplicaActiveCategory(cat);
                        setReplicaActiveSubcategory("All");
                      }}
                      style={{
                        padding: "0.35rem 0.85rem",
                        fontSize: 8,
                        fontFamily: "Space Mono,monospace",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        background: isActive ? "#e63946" : "transparent",
                        color: isActive ? "#fff" : "rgba(255,255,255,0.4)",
                        border: `1px solid ${isActive ? "#e63946" : "rgba(255,255,255,0.15)"}`,
                        cursor: "pointer",
                        borderRadius: "100px",
                        transition: "all 0.2s"
                      }}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Replica Subcategories Bar */}
              {replicaActiveSubcategories.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2rem" }}>
                  <button
                    type="button"
                    onClick={() => setReplicaActiveSubcategory("All")}
                    style={{
                      padding: "0.3rem 0.65rem",
                      fontSize: 7,
                      fontFamily: "Space Mono,monospace",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      background: replicaActiveSubcategory === "All" ? "rgba(255,255,255,0.1)" : "transparent",
                      color: replicaActiveSubcategory === "All" ? "#fff" : "rgba(255,255,255,0.3)",
                      border: "1px solid rgba(255,255,255,0.05)",
                      cursor: "pointer",
                      borderRadius: "100px",
                      transition: "all 0.2s"
                    }}
                  >
                    All {replicaActiveCategory}
                  </button>
                  {replicaActiveSubcategories.map((sub) => {
                    const isActiveSub = replicaActiveSubcategory.toLowerCase() === sub.name.toLowerCase();
                    return (
                      <button
                        key={sub.name}
                        type="button"
                        onClick={() => setReplicaActiveSubcategory(sub.name)}
                        style={{
                          padding: "0.3rem 0.65rem",
                          fontSize: 7,
                          fontFamily: "Space Mono,monospace",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          background: isActiveSub ? "rgba(230,57,70,0.15)" : "transparent",
                          color: isActiveSub ? "#fff" : "rgba(255,255,255,0.3)",
                          border: `1px solid ${isActiveSub ? "#e63946" : "rgba(255,255,255,0.05)"}`,
                          cursor: "pointer",
                          borderRadius: "100px",
                          transition: "all 0.2s"
                        }}
                      >
                        {sub.name}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Replica Grid Container */}
              <div className="grid grid-cols-4 gap-4 w-full relative min-h-[150px]" style={{ gridAutoRows: 'minmax(0, 1fr)' }}>
                {replicaFilteredItems.map((item) => {
                  const isVertical = item.layout === "Vertical";
                  const driveMatch = item.thumbnailUrl?.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
                  const displayThumb = driveMatch
                    ? `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w800`
                    : item.thumbnailUrl;

                  return (
                    <div
                      key={item.id}
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, item)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, item)}
                      className={`relative overflow-hidden group select-none border border-white/5 bg-[#121212] transition-transform duration-250 ${
                        isVertical ? "row-span-2 col-span-1 h-full" : "col-span-1 row-span-1 aspect-[4/3]"
                      }`}
                      style={{
                        cursor: "grab",
                        opacity: draggedIdx === projects.findIndex(p => p.id === item.id) ? 0.35 : 1,
                        border: "1px solid rgba(255,255,255,0.05)"
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = "#e63946";
                        e.currentTarget.style.transform = "scale(0.99)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      {/* Drag Hint Tag */}
                      <div style={{ position: "absolute", top: 8, left: 8, zIndex: 10, background: "rgba(0,0,0,0.65)", border: "1px solid rgba(255,255,255,0.1)", padding: "1px 5px" }}>
                        <span style={{ fontSize: 6, fontFamily: "Space Mono,monospace", color: "#e63946", letterSpacing: "0.15em" }}>DRAG</span>
                      </div>

                      {/* Video Thumbnail */}
                      {displayThumb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={displayThumb}
                          alt={item.title}
                          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                        />
                      ) : (
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#181818" }}>
                          <span style={{ fontSize: 8, fontFamily: "Space Mono,monospace", color: "rgba(255,255,255,0.2)" }}>NO THUMB</span>
                        </div>
                      )}

                      {/* Corner SVG Brackets (Replica) */}
                      <svg style={{ position: "absolute", top: 6, left: 6, pointerEvents: "none", zIndex: 5 }} width="10" height="10" viewBox="0 0 25 25" fill="none"><path d="M0.5 24.5V0.5H24.5" stroke="#e1e6e1" strokeWidth="2" /></svg>
                      <svg style={{ position: "absolute", top: 6, right: 6, pointerEvents: "none", zIndex: 5 }} width="10" height="10" viewBox="0 0 25 25" fill="none"><path d="M0 0.5H24V24.5" stroke="#e1e6e1" strokeWidth="2" /></svg>
                      <svg style={{ position: "absolute", bottom: 6, right: 6, pointerEvents: "none", zIndex: 5 }} width="10" height="10" viewBox="0 0 25 25" fill="none"><path d="M0 24H24V0" stroke="#e1e6e1" strokeWidth="2" /></svg>
                      <svg style={{ position: "absolute", bottom: 6, left: 6, pointerEvents: "none", zIndex: 5 }} width="10" height="10" viewBox="0 0 25 25" fill="none"><path d="M0.5 0V24H24.5" stroke="#e1e6e1" strokeWidth="2" /></svg>

                      {/* Overlay text detail */}
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)", pointerEvents: "none" }} />
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0.75rem", pointerEvents: "none" }}>
                        <p style={{ fontSize: 6, fontFamily: "Space Mono,monospace", color: "#e63946", letterSpacing: "0.15em", textTransform: "uppercase", margin: 0 }}>
                          {item.category} {item.subcategory ? `· ${item.subcategory}` : ""}
                        </p>
                        <h4 style={{ fontSize: 10, color: "#fff", letterSpacing: "0.02em", margin: "2px 0 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {item.title || "Untitled Project"}
                        </h4>
                      </div>
                    </div>
                  );
                })}
                {replicaFilteredItems.length === 0 && (
                  <div style={{ gridColumn: "span 4", textAlign: "center", padding: "3rem", border: "1px dashed rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.01)" }}>
                    <span style={{ fontSize: 9, fontFamily: "Space Mono,monospace", color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em" }}>
                      NO PROJECTS MATCHING FILTER
                    </span>
                  </div>
                )}
              </div>
            </section>

            {/* ── Project Video URLs ────────────────────────────────────────── */}
            <section>
              <h2 style={sectionHeadingStyle}>Selected Project Videos</h2>
              
              {/* Filter & Search Bar */}
              <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
                padding: "1.25rem",
                background: "#111",
                border: "1px solid rgba(255,255,255,0.06)",
                marginBottom: "1.5rem"
              }}>
                <div style={{ ...fieldStyle, flex: "2 1 200px" }}>
                  <label style={labelStyle}>Search Title</label>
                  <input
                    type="text"
                    value={filterText}
                    onChange={e => setFilterText(e.target.value)}
                    placeholder="Search by project title..."
                    style={{ ...inputStyle, padding: "0.6rem 0.85rem" }}
                    onFocus={e => (e.target.style.borderColor = "#e63946")}
                    onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                </div>
                <div style={{ ...fieldStyle, flex: "1 1 150px" }}>
                  <label style={labelStyle}>Filter Category</label>
                  <select
                    value={filterCategory}
                    onChange={e => {
                      setFilterCategory(e.target.value);
                      setFilterSubcategory("All");
                    }}
                    style={{ ...inputStyle, padding: "0.6rem 0.85rem", background: "#0a0a0a", cursor: "pointer" }}
                    onFocus={e => (e.target.style.borderColor = "#e63946")}
                    onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                  >
                    <option value="All">All Categories</option>
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                {subcategories.filter(s => filterCategory === "All" || s.category?.toLowerCase() === filterCategory.toLowerCase()).length > 0 && (
                  <div style={{ ...fieldStyle, flex: "1 1 150px" }}>
                    <label style={labelStyle}>Filter Subcategory</label>
                    <select
                      value={filterSubcategory}
                      onChange={e => setFilterSubcategory(e.target.value)}
                      style={{ ...inputStyle, padding: "0.6rem 0.85rem", background: "#0a0a0a", cursor: "pointer" }}
                      onFocus={e => (e.target.style.borderColor = "#e63946")}
                      onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                    >
                      <option value="All">All Subcategories</option>
                      {subcategories
                        .filter(s => filterCategory === "All" || s.category?.toLowerCase() === filterCategory.toLowerCase())
                        .map(sub => (
                          <option key={sub.name} value={sub.name}>{sub.name}</option>
                        ))}
                    </select>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                {filteredProjects.map(({ proj, index }) => (
                  <div key={proj.id || index} style={{ padding: "1.5rem", border: "1px solid rgba(255,255,255,0.06)", background: "#111", display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <span style={{ fontFamily: "Space Mono,monospace", fontSize: 11, color: "#e63946", letterSpacing: "0.2em" }}>
                          #{String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteProject(index)}
                        style={{
                          background: "none",
                          border: "none",
                          fontFamily: "Space Mono,monospace",
                          fontSize: 9,
                          color: "rgba(240,240,240,0.35)",
                          letterSpacing: "0.2em",
                          textTransform: "uppercase",
                          cursor: "pointer"
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#e63946")}
                        onMouseLeave={e => (e.currentTarget.style.color = "rgba(240,240,240,0.35)")}
                      >
                        [Delete Project]
                      </button>
                    </div>

                    <div style={fieldStyle}>
                      <label style={labelStyle}>Project Title</label>
                      <input type="text" value={proj.title} onChange={e => updateProject(index, "title", e.target.value)}
                        placeholder="e.g. Cinematic Wedding Trailer"
                        style={inputStyle}
                        onFocus={e => (e.target.style.borderColor = "#e63946")}
                        onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
                    </div>

                    <div style={fieldStyle}>
                      <label style={labelStyle}>Video URL (YouTube / Drive / Direct MP4)</label>
                      <input type="url" value={proj.videoUrl} onChange={e => updateProject(index, "videoUrl", e.target.value)}
                        placeholder="https://youtu.be/... or drive.google.com/..."
                        style={inputStyle}
                        onFocus={e => (e.target.style.borderColor = "#e63946")}
                        onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
                    </div>

                    <div style={fieldStyle}>
                      <label style={labelStyle}>Thumbnail Image URL <span style={{ color: "rgba(240,240,240,0.2)" }}>(optional)</span></label>
                      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                        <input type="url" value={proj.thumbnailUrl} onChange={e => updateProject(index, "thumbnailUrl", e.target.value)}
                          placeholder="https://... (auto-detected for YouTube)"
                          style={{ ...inputStyle, flex: 1 }}
                          onFocus={e => (e.target.style.borderColor = "#e63946")}
                          onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
                        {(() => {
                          const ytRegex = /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
                          const ytMatch = proj.videoUrl?.match(ytRegex);
                          
                          // First check thumbnailUrl share link
                          const driveMatch = proj.thumbnailUrl?.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
                          const driveUcMatch = proj.thumbnailUrl?.match(/drive\.google\.com\/uc\?.*?id=([a-zA-Z0-9_-]+)/);
                          
                          let resolvedThumb = "";
                          if (driveMatch) {
                            resolvedThumb = `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w200`;
                          } else if (driveUcMatch) {
                            resolvedThumb = `https://drive.google.com/thumbnail?id=${driveUcMatch[1]}&sz=w200`;
                          } else if (proj.thumbnailUrl) {
                            resolvedThumb = proj.thumbnailUrl;
                          } else if (ytMatch) {
                            resolvedThumb = `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
                          }

                          if (resolvedThumb) {
                            return (
                              <div style={{ flexShrink: 0, position: "relative", width: 60, height: 35, background: "#111", borderRadius: 4, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={resolvedThumb} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
                      <div style={fieldStyle}>
                        <label style={labelStyle}>Category</label>
                        <select value={proj.category} onChange={e => {
                          const newCat = e.target.value;
                          updateProject(index, "category", newCat);
                          updateProject(index, "subcategory", "");
                        }}
                          style={{ ...inputStyle, background: "#0a0a0a", cursor: "pointer" }}
                          onFocus={e => (e.target.style.borderColor = "#e63946")}
                          onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}>
                          {categories.map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div style={fieldStyle}>
                        <label style={labelStyle}>Subcategory</label>
                        <select value={proj.subcategory ?? ""} onChange={e => updateProject(index, "subcategory", e.target.value)}
                          style={{ ...inputStyle, background: "#0a0a0a", cursor: "pointer" }}
                          onFocus={e => (e.target.style.borderColor = "#e63946")}
                          onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}>
                          <option value="">None / All</option>
                          {subcategories
                            .filter(sub => sub.category?.toLowerCase() === proj.category?.toLowerCase())
                            .map(sub => (
                              <option key={sub.name} value={sub.name}>{sub.name}</option>
                            ))}
                        </select>
                      </div>
                      <div style={fieldStyle}>
                        <label style={labelStyle}>Layout Type</label>
                        <select value={proj.layout ?? "Horizontal"} onChange={e => updateProject(index, "layout", e.target.value as any)}
                          style={{ ...inputStyle, background: "#0a0a0a", cursor: "pointer" }}
                          onFocus={e => (e.target.style.borderColor = "#e63946")}
                          onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}>
                          <option value="Horizontal">Horizontal (16:9)</option>
                          <option value="Vertical">Vertical (9:16)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddProject}
                  style={{
                    padding: "1rem",
                    border: "1px dashed rgba(255,255,255,0.15)",
                    background: "rgba(255,255,255,0.01)",
                    color: "rgba(240,240,240,0.6)",
                    fontFamily: "Space Mono,monospace",
                    fontSize: 10,
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    textAlign: "center",
                    marginTop: "1rem",
                    width: "100%",
                    boxSizing: "border-box"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "#e63946";
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.background = "rgba(230,57,70,0.03)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                    e.currentTarget.style.color = "rgba(240,240,240,0.6)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.01)";
                  }}
                >
                  + Add New Video Project
                </button>
              </div>
            </section>

            {/* ── Contact & Social Links ────────────────────────────────────── */}
            <section>
              <h2 style={sectionHeadingStyle}>Contact & Social Links</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                {[
                  { label: "Email Address", value: email, onChange: setEmail, type: "email", placeholder: "your@email.com" },
                  { label: "WhatsApp Number", value: whatsapp, onChange: setWhatsapp, type: "text", placeholder: "+91 9999999999" },
                  { label: "Instagram URL", value: instagram, onChange: setInstagram, type: "url", placeholder: "https://instagram.com/..." },
                  { label: "LinkedIn URL", value: linkedin, onChange: setLinkedin, type: "url", placeholder: "https://linkedin.com/in/..." },
                ].map(({ label, value, onChange, type, placeholder }) => (
                  <div key={label} style={fieldStyle}>
                    <label style={labelStyle}>{label}</label>
                    <input type={type} value={value} onChange={e => onChange(e.target.value)}
                      placeholder={placeholder} style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = "#e63946")}
                      onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
                  </div>
                ))}
              </div>
            </section>

            {/* ── Save Button ───────────────────────────────────────────────── */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "2rem" }}>
              <button onClick={handleSave} disabled={saving}
                style={{ padding: "1rem 3rem", background: saving ? "rgba(230,57,70,0.5)" : "#e63946", color: "#fff", border: "none", fontFamily: "Space Mono,monospace", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", cursor: saving ? "not-allowed" : "pointer", transition: "background 0.2s" }}
                onMouseEnter={e => !saving && (e.currentTarget.style.background = "#c1121f")}
                onMouseLeave={e => !saving && (e.currentTarget.style.background = "#e63946")}>
                {saving ? "Saving..." : "Save All Settings →"}
              </button>
              <p style={{ fontFamily: "Space Mono,monospace", fontSize: 8, color: "rgba(240,240,240,0.2)", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: "1rem" }}>
                Data is saved to Google Sheets and synced to the live site automatically.
              </p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

// Turn database rows into the JSON shape the frontend uses.

export const WATCH_SELECT = `
  w.id, w.model_name, w.collection, w.reference_number, w.price_aed, w.case_size_mm, w.material, w.movement,
  w.water_resistance_m, w.power_reserve_hours, w.gender, w.stock_qty, w.is_featured, w.image_url,
  w.description, w.description_ar, w.calibre, w.dial, w.material_detail, w.created_at,
  b.slug AS brand_slug, b.name AS brand_name`

export function toWatch(r) {
  return {
    id: r.id,
    brand: { slug: r.brand_slug, name: r.brand_name },
    model: r.model_name,
    collection: r.collection,
    ref: r.reference_number,
    price: Number(r.price_aed),
    caseSize: Number(r.case_size_mm),
    material: r.material,
    materialDetail: r.material_detail,
    movement: r.movement,
    calibre: r.calibre,
    dial: r.dial,
    waterResistance: r.water_resistance_m,
    powerReserve: r.power_reserve_hours,
    gender: r.gender,
    stock: r.stock_qty,
    featured: r.is_featured,
    imageUrl: r.image_url,
    description: r.description,
    descriptionAr: r.description_ar,
    createdAt: r.created_at,
  }
}

export function toBrand(r) {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    country: r.country_of_origin,
    founded: r.founded_year,
    story: r.heritage_story,
    storyAr: r.heritage_story_ar,
  }
}

export function toBoutique(r) {
  return {
    id: r.id,
    name: r.name,
    city: r.city,
    cityAr: r.city_ar,
    country: r.country,
    address: r.address,
    addressAr: r.address_ar,
    openingHours: r.opening_hours,
    whatsapp: r.whatsapp_number,
  }
}

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import '@google/model-viewer';
const flowerModel = "https://rri4tg6y27zcjsqa.public.blob.vercel-storage.com/flower.glb";
import { createDesign, updateDesign, getDesign } from '../../../lib/customDesignApi';
import { useCart } from '../../../context/CartContext';

const CustomDesign = () => {
  // =========================================================================
  // SECTION 1: STATE MANAGEMENT (การจัดการพื้นที่เก็บข้อมูลชั่วคราว)
  // =========================================================================
  
  /* 
    State: inventory 
    Frontend: เก็บตัวเลือกสินค้าโดยแบ่งเป็น 2 กลุ่มหลัก คือ bases และ flowers
    Backend: ส่งข้อมูลจาก Database (Inventory) มาให้ Frontend นำไปลูปแสดงผล
  */
  const [inventory, setInventory] = useState({
    bases: [],
    flowers: [],
  });

  /* 
    State: selections 
    Frontend: เก็บค่า ID ของสิ่งที่ User เลือก "พร้อมจำนวน (Quantity)" ของดอกไม้แต่ละชนิด
    Backend: Payload ที่จะถูกส่งไปตอน Add to cart หรือ Save จะมีโครงสร้างแบบนี้:
             {
               baseId: '...',
               flower1Id: '...', flower1Qty: 1,
               flower2Id: '...', flower2Qty: 3,
               flower3Id: '...', flower3Qty: 2
             }
  */
  const [selections, setSelections] = useState({
    baseId: '',
    flower1Id: '',
    flower1Qty: 1, // จำนวนดอกไม้ชนิดที่ 1
    flower2Id: '',
    flower2Qty: 1, // จำนวนดอกไม้ชนิดที่ 2
    flower3Id: '',
    flower3Qty: 1  // จำนวนดอกไม้ชนิดที่ 3
  });

  /* State สำหรับ Popups */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saveFormData, setSaveFormData] = useState({
    name: '',
    description: '',
    preset: 1 // ช่องเซฟ 1-5 (user มีได้สูงสุด 5 ช่อ)
  });
  /* preset ที่เลือกมีช่ออื่นอยู่แล้ว (backend ตอบ 409 PRESET_TAKEN) → { preset, name } ใช้โชว์คำเตือน + ให้กดยืนยันเซฟทับ
     null = ยังไม่ชน / เปลี่ยน preset แล้ว */
  const [presetConflict, setPresetConflict] = useState(null);
  const [isCartPopupOpen, setIsCartPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  /* Edit mode: มาจากลิงก์ /?edit=<designId> ที่กดจาก CustomList.jsx
     มี id นี้ = กำลังแก้ design เดิม (PATCH), ไม่มี = สร้างใหม่ (POST) */
  const [searchParams, setSearchParams] = useSearchParams();
  const { addBouquetToCart } = useCart();
  const editingDesignId = searchParams.get('edit');

  // =========================================================================
  // SECTION 2: LIFECYCLE & BACKEND INTEGRATION
  // =========================================================================

  useEffect(() => {
    const fetchInventory = async () => {
      setIsLoading(true);
      try {
        // [INVENTORY TODO]: ตอนนี้ยัง hardcode รายการไว้ชั่วคราว (เลือกมาแค่บางส่วน ใน DB มีดอกไม้ 18 ชนิด)
        // id ด้านล่างเป็น _id จริงที่ copy มาจาก MongoDB collection 'inventory_items' (DB FlowerShop)
        // ⚠️ seed (productquery.mongodb.js) ลบข้อมูลแล้วสร้าง _id ใหม่แบบสุ่มทุกครั้งที่รัน ถ้ามีคน seed ใหม่ id พวกนี้จะใช้ไม่ได้ แล้ว Save จะ error
        // คนที่ทำ inventory: ทำ GET /api/v1/inventory-items (ตอนนี้ inventory-items.routes.js ยังว่าง) แล้วเปลี่ยนตรงนี้เป็น fetch จาก API
        //   - bases = category 'wrapping_paper' + 'vase', flowers = category 'flower'
        //   - ใช้ _id ของแต่ละ item เป็น id ของ dropdown
        //   - ค่า default ใน setSelections ด้านล่างก็ต้องเอามาจากข้อมูลที่ fetch ได้ (เช่น item ตัวแรกของแต่ละกลุ่ม)
        setTimeout(() => {
          setInventory({
            // Bases: รวม wrapping_paper และ vase
            bases: [
              { id: '6ab0ef63fb9b2838d7c38a2f', name: 'Kraft Wrapping Paper' },
              { id: '6ab0ef63fb9b2838d7c38a31', name: 'Korean Wrapping Paper' },
              { id: '6ab0ef63fb9b2838d7c38a36', name: 'Satin Ribbon' },
              { id: '6ab0ef63fb9b2838d7c38a37', name: 'Tall Glass Vase' }
            ],
            // Flowers: category 'flower'
            flowers: [
              { id: '6ab0ef63fb9b2838d7c38a2e', name: 'Ecuadorian Red Rose' },
              { id: '6ab0ef63fb9b2838d7c38a30', name: 'Pink Tulip' },
              { id: '6ab0ef63fb9b2838d7c38a33', name: 'Sunflower' },
              { id: '6ab0ef63fb9b2838d7c38a34', name: 'Blue Hydrangea' },
              { id: '6ab0ef63fb9b2838d7c38a38', name: "Baby's Breath" }
            ]
          });

          // ตั้งค่า Default ตอนโหลดหน้าเว็บเสร็จ
          // ถ้ามาจากปุ่ม edit แล้ว design เดิมโหลดเสร็จก่อน (prev.baseId มีค่าแล้ว) ห้ามเขียนทับ ไม่งั้น dropdown จะเด้งกลับเป็นค่า default
          setSelections((prev) => prev.baseId ? prev : {
            baseId: '6ab0ef63fb9b2838d7c38a2f', // Kraft Wrapping Paper
            flower1Id: '6ab0ef63fb9b2838d7c38a2e', flower1Qty: 1, // Ecuadorian Red Rose
            flower2Id: '6ab0ef63fb9b2838d7c38a33', flower2Qty: 1, // Sunflower
            flower3Id: '6ab0ef63fb9b2838d7c38a30', flower3Qty: 1  // Pink Tulip
          });
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error("Failed to fetch inventory", error);
      }
    };
    fetchInventory();
  }, []);

  // ถ้ามาจาก "?edit=<id>" (กด edit ที่ CustomList.jsx) ให้ดึง design เดิมมา prefill ฟอร์ม
  useEffect(() => {
    if (!editingDesignId) return;

    const loadDesignToEdit = async () => {
      try {
        const design = await getDesign(editingDesignId);

        // component ที่เป็น wrapping_paper/vase ถือเป็น "base" (ช่องเดียว) ที่เหลือถือเป็น "flower" (เรียงเข้า flower1-3)
        const baseComponent = design.components.find((c) =>
          ['wrapping_paper', 'vase'].includes(c.inventory_item_id?.category),
        );
        const flowerComponents = design.components.filter(
          (c) => c !== baseComponent,
        );

        // UI นี้รองรับแค่ base 1 ช่อง + flower 3 ช่องตายตัว ถ้า design เดิมมีมากกว่านี้ ส่วนเกินจะถูกตัดออกตอน edit
        setSelections({
          baseId: baseComponent?.inventory_item_id?._id || '',
          flower1Id: flowerComponents[0]?.inventory_item_id?._id || '',
          flower1Qty: flowerComponents[0]?.quantity || 1,
          flower2Id: flowerComponents[1]?.inventory_item_id?._id || '',
          flower2Qty: flowerComponents[1]?.quantity || 1,
          flower3Id: flowerComponents[2]?.inventory_item_id?._id || '',
          flower3Qty: flowerComponents[2]?.quantity || 1,
        });
        setSaveFormData((prev) => ({
          ...prev,
          name: design.design_name || '',
          description: design.design_description || '',
          preset: design.preset || 1,
        }));
      } catch (error) {
        console.error("Failed to load design for editing", error);
        setSaveError("Could not load the bouquet you're trying to edit.");
      }
    };
    loadDesignToEdit();
  }, [editingDesignId]);

  // ปิด Popup ด้วยปุ่ม ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          setIsModalOpen(false);
          setIsCartPopupOpen(false);
        }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // ฟังก์ชันอัปเดต State เมื่อเปลี่ยน Dropdown หรือพิมพ์ตัวเลข
  const handleSelectionChange = (category, value) => {
    setSelections(prev => ({ ...prev, [category]: value }));
  };

  // ส่งช่อที่เลือกอยู่ตอนนี้ไปที่ตะกร้า (POST /api/v1/cart แบบ custom_product)
  // ยังไม่ login → CartContext ขึ้น alert ให้ไป login และได้ false กลับมา / popup Success เปิดเฉพาะตอนเพิ่มสำเร็จจริง
  const handleAddToCart = async () => {
    const added = await addBouquetToCart({
      components: selectionsToComponents(selections),
    });
    if (added) setIsCartPopupOpen(true);
  };

  // แปลง selections (baseId, flower1Id/Qty, flower2Id/Qty, flower3Id/Qty) ให้เป็น components array ตามที่ backend ต้องการ
  const selectionsToComponents = (sel) => {
    const components = [];
    if (sel.baseId) components.push({ inventory_item_id: sel.baseId, quantity: 1 });
    if (sel.flower1Id) components.push({ inventory_item_id: sel.flower1Id, quantity: sel.flower1Qty });
    if (sel.flower2Id) components.push({ inventory_item_id: sel.flower2Id, quantity: sel.flower2Qty });
    if (sel.flower3Id) components.push({ inventory_item_id: sel.flower3Id, quantity: sel.flower3Qty });
    return components;
  };

  const handleConfirmSave = async (e) => {
    e.preventDefault();
    setSaveError('');
    setIsSaving(true);

    const payload = {
      design_name: saveFormData.name,
      design_description: saveFormData.description,
      preset: saveFormData.preset,
      // กดครั้งแรกแล้วชน → โชว์คำเตือน กดอีกครั้ง (preset เดิม) = ยืนยันเซฟทับ
      overwrite: presetConflict?.preset === saveFormData.preset,
      components: selectionsToComponents(selections),
    };

    try {
      if (editingDesignId) {
        await updateDesign(editingDesignId, payload);
        setSearchParams({}); // เอา ?edit=<id> ออกจาก URL หลังแก้เสร็จ กลับเป็นโหมดสร้างใหม่
      } else {
        await createDesign(payload);
      }

      setIsModalOpen(false);
      setSaveFormData({ name: '', description: '', preset: 1 });
      setPresetConflict(null);
    } catch (error) {
      // preset ชน: ไม่ใช่ error จริง ให้โชว์คำเตือนแล้วรอผู้ใช้ยืนยัน (หรือเปลี่ยน preset)
      if (error.code === 'PRESET_TAKEN') {
        setPresetConflict({ preset: saveFormData.preset, name: error.data?.existing_design_name });
        return;
      }
      console.error("Failed to save custom design", error);
      setSaveError(error.message || "Save failed. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // =========================================================================
  // SECTION 3: UI RENDER & JSX
  // =========================================================================
  
  const DropdownIcon = () => (
    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-primary">
      <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 11L1 1H13L7 11Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="white"/>
      </svg>
    </div>
  );

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-125 font-body text-primary">Loading designer...</div>;
  }

  return (
    <div className="w-full bg-tertiary font-body text-neutral p-4 lg:p-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* === คอลัมน์ซ้าย: Preview Image (ขยายเต็มกรอบ / เอา Hover ออก) === */}
        <div className="relative bg-secondary rounded-3xl p-0 flex justify-center items-center min-h-100 lg:min-h-130 shadow-sm border border-black/5 overflow-hidden">
          
          <div className="w-full h-full flex justify-center items-center overflow-hidden rounded-3xl">
            <model-viewer
              src={flowerModel}
              alt="3D custom flower arrangement preview"
              camera-controls
              auto-rotate
              shadow-intensity="1"
              className="w-full h-full rounded-3xl shadow-inner"
            ></model-viewer>
          </div>

        </div>

        {/* === คอลัมน์ขวา: ส่วนเลือกข้อมูล (Dropdown) และปุ่ม === */}
        <div className="flex flex-col justify-center">
          <h1 className="font-display text-4xl lg:text-[42px] text-primary font-bold mb-4 leading-tight">
            Design Your Perfect<br/>Arrangement
          </h1>
          <p className="font-body text-neutral text-sm sm:text-base leading-relaxed mb-8 max-w-md">
            Craft your dream bouquet step by step to create a lovely, bespoke gift.
          </p>

          <div className="space-y-6 mb-10">
            {/* --- Dropdown 1: Base (Wrapping Paper หรือ Vase) --- */}
            <div>
              <label className="block text-sm font-semibold text-neutral mb-2">Base (Wrapping Paper / Vase)</label>
              <div className="relative">
                <select 
                  className="w-full bg-base-100 border border-border text-neutral rounded-2xl px-5 py-3.5 appearance-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer"
                  value={selections.baseId}
                  onChange={(e) => handleSelectionChange('baseId', e.target.value)}
                >
                  {inventory.bases.map(item => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
                <DropdownIcon />
              </div>
            </div>

            {/* --- ตัวเลือกดอกไม้ 1 พร้อมช่องใส่จำนวน --- */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <label className="block text-sm font-semibold text-neutral mb-2">Flower 1</label>
                <div className="relative">
                  <select 
                    className="w-full bg-base-100 border border-border text-neutral rounded-2xl px-5 py-3.5 appearance-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer"
                    value={selections.flower1Id}
                    onChange={(e) => handleSelectionChange('flower1Id', e.target.value)}
                  >
                    {inventory.flowers.map(item => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                  <DropdownIcon />
                </div>
              </div>
              <div className="w-24">
                <label className="block text-sm font-semibold text-neutral mb-2 text-center">Qty</label>
                <input 
                  type="number" 
                  min="1"
                  className="w-full bg-base-100 border border-border text-neutral rounded-2xl px-4 py-3.5 text-center focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  value={selections.flower1Qty}
                  onChange={(e) => handleSelectionChange('flower1Qty', Math.max(1, parseInt(e.target.value) || 1))}
                />
              </div>
            </div>

            {/* --- ตัวเลือกดอกไม้ 2 พร้อมช่องใส่จำนวน --- */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <label className="block text-sm font-semibold text-neutral mb-2">Flower 2</label>
                <div className="relative">
                  <select 
                    className="w-full bg-base-100 border border-border text-neutral rounded-2xl px-5 py-3.5 appearance-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer"
                    value={selections.flower2Id}
                    onChange={(e) => handleSelectionChange('flower2Id', e.target.value)}
                  >
                    {inventory.flowers.map(item => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                  <DropdownIcon />
                </div>
              </div>
              <div className="w-24">
                <label className="block text-sm font-semibold text-neutral mb-2 text-center">Qty</label>
                <input 
                  type="number" 
                  min="1"
                  className="w-full bg-base-100 border border-border text-neutral rounded-2xl px-4 py-3.5 text-center focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  value={selections.flower2Qty}
                  onChange={(e) => handleSelectionChange('flower2Qty', Math.max(1, parseInt(e.target.value) || 1))}
                />
              </div>
            </div>

            {/* --- ตัวเลือกดอกไม้ 3 พร้อมช่องใส่จำนวน --- */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <label className="block text-sm font-semibold text-neutral mb-2">Flower 3</label>
                <div className="relative">
                  <select 
                    className="w-full bg-base-100 border border-border text-neutral rounded-2xl px-5 py-3.5 appearance-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer"
                    value={selections.flower3Id}
                    onChange={(e) => handleSelectionChange('flower3Id', e.target.value)}
                  >
                    {inventory.flowers.map(item => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                  <DropdownIcon />
                </div>
              </div>
              <div className="w-24">
                <label className="block text-sm font-semibold text-neutral mb-2 text-center">Qty</label>
                <input 
                  type="number" 
                  min="1"
                  className="w-full bg-base-100 border border-border text-neutral rounded-2xl px-4 py-3.5 text-center focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  value={selections.flower3Qty}
                  onChange={(e) => handleSelectionChange('flower3Qty', Math.max(1, parseInt(e.target.value) || 1))}
                />
              </div>
            </div>
          </div>

          {/* --- ปุ่ม Action --- */}
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={handleAddToCart}
              className="px-8 py-3 rounded-full bg-primary text-[#FBF9F8] font-semibold text-sm hover:opacity-90 transition-all cursor-pointer"
            >
              Add to Cart
            </button>
            <button 
              onClick={() => {
                setPresetConflict(null); // เปิด modal ใหม่ เริ่มจากยังไม่ชน preset
                setIsModalOpen(true);
              }}
              className="px-8 py-3 rounded-full border border-primary text-primary font-semibold text-sm hover:bg-primary hover:text-[#FBF9F8] transition-all cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 4: MODALS & POPUPS
          ========================================================================= */}

      {/* --- Popup 1: แจ้งเตือน Add to Cart สำเร็จ --- */}
      {isCartPopupOpen && (
        <div 
          className="fixed inset-0 bg-white/40 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all"
          onClick={() => setIsCartPopupOpen(false)}
        >
          <div 
            className="bg-secondary p-8 rounded-3xl max-w-sm w-full shadow-2xl border border-[#E5E0DA] text-center relative animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()} 
          >
            <div className="w-16 h-16 bg-[#F3F3F0] rounded-full flex items-center justify-center mx-auto mb-5 text-primary border border-primary/20">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-display text-2xl font-bold text-primary mb-2">Success!</h3>
            <p className="text-neutral text-sm mb-8">Your bespoke arrangement has been added to the cart.</p>
            <button 
              onClick={() => setIsCartPopupOpen(false)}
              className="w-full px-8 py-3 rounded-full bg-primary text-[#FBF9F8] font-semibold text-sm hover:opacity-90 transition-all cursor-pointer"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* --- Popup 2: Form ตั้งชื่อสำหรับ Save Design --- */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-white/40 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all"
          onClick={() => setIsModalOpen(false)} 
        >
          <div 
            className="bg-secondary p-6 sm:p-8 rounded-3xl max-w-sm w-full shadow-2xl border border-[#E5E0DA] relative animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()} 
          >
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-neutral hover:text-primary transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 className="font-display text-2xl font-bold text-primary mb-6 border-b border-border/50 pb-3 inline-block">
              {editingDesignId ? 'Edit Custom Design' : 'Custom Design'}
            </h2>

            <form onSubmit={handleConfirmSave} className="space-y-4">
              <div>
                <label className="block text-sm text-neutral mb-1.5">Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="My Custom Bouquet"
                  className="w-full bg-base-100 border border-[#E5E0DA] rounded-xl px-4 py-2.5 text-neutral focus:outline-none focus:ring-1 focus:ring-primary"
                  value={saveFormData.name}
                  onChange={(e) => setSaveFormData({...saveFormData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-neutral mb-1.5">Description</label>
                <input 
                  type="text" 
                  placeholder="e.g. Birthday gift for mom"
                  className="w-full bg-base-100 border border-[#E5E0DA] rounded-xl px-4 py-2.5 text-neutral focus:outline-none focus:ring-1 focus:ring-primary"
                  value={saveFormData.description}
                  onChange={(e) => setSaveFormData({...saveFormData, description: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-neutral mb-1.5">Preset</label>
                <div className="relative">
                  <select 
                    className="w-full bg-base-100 border border-[#E5E0DA] rounded-xl px-4 py-2.5 appearance-none text-neutral focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                    value={saveFormData.preset}
                    onChange={(e) => {
                      // ค่าจาก <select> เป็น string เสมอ แปลงเป็นเลขก่อน backend รับแค่ 1-5 แบบ number
                      setSaveFormData({...saveFormData, preset: Number(e.target.value)});
                      setPresetConflict(null);
                    }}
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>Preset {n}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                     <svg className="w-4 h-4 text-neutral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                     </svg>
                  </div>
                </div>
              </div>
              {presetConflict && (
                <p className="text-center text-sm text-amber-700">
                  Preset {presetConflict.preset} already has "{presetConflict.name}".
                  Saving will replace it and the old bouquet will be deleted.
                  Choose another preset to keep it.
                </p>
              )}
              {saveError && (
                <p className="text-center text-sm text-red-600">{saveError}</p>
              )}
              <div className="pt-6 flex justify-center">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-8 py-3 rounded-full border border-primary text-primary font-semibold text-sm hover:bg-primary hover:text-[#FBF9F8] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving
                    ? 'Saving...'
                    : presetConflict
                      ? `Replace Preset ${presetConflict.preset}`
                      : editingDesignId
                      ? 'Save Changes'
                      : 'Confirm Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDesign;
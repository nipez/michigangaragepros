-- Import statewide prospecting spreadsheet + enrich company profiles
ALTER TABLE companies ADD COLUMN phone_alt TEXT;
ALTER TABLE companies ADD COLUMN address TEXT;
ALTER TABLE companies ADD COLUMN website TEXT;
ALTER TABLE companies ADD COLUMN source_url TEXT;
ALTER TABLE companies ADD COLUMN source_type TEXT;
ALTER TABLE companies ADD COLUMN confidence TEXT;
ALTER TABLE companies ADD COLUMN region TEXT;
ALTER TABLE companies ADD COLUMN notes TEXT;

DELETE FROM company_service_areas;
DELETE FROM company_services;
DELETE FROM companies;

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  '313-garage-door',
  '313 Garage Door',
  4.9, 500, 'Detroit, MI', 'detroit',
  '["Repair", "Installation", "Emergency"]',
  0, 1,
  '313 Garage Door provides expert repair, installation, and 24/7 emergency service across Metro Detroit with same-day appointments and upfront pricing.',
  'Mon–Sat, 7am–8pm', '24/7 response', '313-591-9635', NULL,
  NULL, 'https://313garagedoors.com/',
  NULL, NULL, NULL, NULL, NULL,
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = '313-garage-door';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = '313-garage-door';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = '313-garage-door';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = '313-garage-door';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = '313-garage-door';
INSERT INTO company_services (company_id, service) SELECT id, 'Emergency Service' FROM companies WHERE slug = '313-garage-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Detroit' FROM companies WHERE slug = '313-garage-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Livonia' FROM companies WHERE slug = '313-garage-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Dearborn' FROM companies WHERE slug = '313-garage-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Warren' FROM companies WHERE slug = '313-garage-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Sterling Heights' FROM companies WHERE slug = '313-garage-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Troy' FROM companies WHERE slug = '313-garage-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Southfield' FROM companies WHERE slug = '313-garage-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Royal Oak' FROM companies WHERE slug = '313-garage-door';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  '5-star-garage-door-repair-llc-new-haven',
  '5 Star Garage Door repair LLC',
  4.9, 96, 'New Haven, MI', 'new-haven',
  '["Repair", "Installation"]',
  0, 0,
  '5 Star Garage Door repair LLC provides garage door installation and service/repair in New Haven, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '586-713-2715', NULL,
  '5420 County Line Rd, New Haven, MI 48048', NULL,
  'https://www.google.com/maps/search/?api=1&query=5+Star+Garage+Door+repair+LLC+5420+County+Line+Rd%2C+New+Haven%2C+MI+48048+Michigan', 'Current Business Index', 'High', 'Port Huron / St. Clair-Macomb', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = '5-star-garage-door-repair-llc-new-haven';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = '5-star-garage-door-repair-llc-new-haven';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = '5-star-garage-door-repair-llc-new-haven';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = '5-star-garage-door-repair-llc-new-haven';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = '5-star-garage-door-repair-llc-new-haven';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'New Haven' FROM companies WHERE slug = '5-star-garage-door-repair-llc-new-haven';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Port Huron' FROM companies WHERE slug = '5-star-garage-door-repair-llc-new-haven';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Clinton Township' FROM companies WHERE slug = '5-star-garage-door-repair-llc-new-haven';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Shelby Township' FROM companies WHERE slug = '5-star-garage-door-repair-llc-new-haven';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'a-and-r-garage-doors-ypsilanti',
  'A and R Garage Doors',
  4.9, 83, 'Ypsilanti, MI', 'ypsilanti',
  '["Repair", "Installation"]',
  0, 0,
  'A and R Garage Doors provides garage door installation and service/repair in Ypsilanti, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '734-383-6759', NULL,
  '2202 Woodview Dr, Ypsilanti, MI 48198', NULL,
  'https://www.google.com/maps/search/?api=1&query=A+and+R+Garage+Doors+2202+Woodview+Dr%2C+Ypsilanti%2C+MI+48198+Michigan', 'Current Business Index', 'High', 'Ann Arbor / Livingston', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'a-and-r-garage-doors-ypsilanti';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'a-and-r-garage-doors-ypsilanti';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'a-and-r-garage-doors-ypsilanti';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'a-and-r-garage-doors-ypsilanti';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'a-and-r-garage-doors-ypsilanti';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Ypsilanti' FROM companies WHERE slug = 'a-and-r-garage-doors-ypsilanti';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Ann Arbor' FROM companies WHERE slug = 'a-and-r-garage-doors-ypsilanti';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Brighton' FROM companies WHERE slug = 'a-and-r-garage-doors-ypsilanti';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Howell' FROM companies WHERE slug = 'a-and-r-garage-doors-ypsilanti';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'a1-garage-door-service-clawson',
  'A1 Garage Door Service',
  4.8, 2638, 'Clawson, MI', 'clawson',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'A1 Garage Door Service provides garage door installation and service/repair in Clawson, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '248-282-3272', '313-752-2590',
  '642 S Main St Suite 103, Clawson, MI 48017', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-1-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance. Cross-checked against a current 2026 business-index result. Clopay directory lists: 642 S Main Street, Suite 103, Clawson, MI 48017.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'a1-garage-door-service-clawson';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'a1-garage-door-service-clawson';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'a1-garage-door-service-clawson';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'a1-garage-door-service-clawson';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'a1-garage-door-service-clawson';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Clawson' FROM companies WHERE slug = 'a1-garage-door-service-clawson';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'a1-garage-door-service',
  'A1 Garage Door Service',
  4.9, 1439, 'Grand Rapids, MI', 'grand-rapids',
  '["Repair", "Springs", "Openers", "Emergency", "Clopay Dealer"]',
  0, 1,
  'A1 Garage Door Service operates a large West Michigan crew network for residential garage door repair, springs, openers, and same-day emergency calls.',
  'Mon–Sun, 7am–9pm', '24/7 response', '616-217-3038', NULL,
  '3417 Roger B Chaffee Memorial Blvd SE, Suite 303, Grand Rapids, MI 49548-2323', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-1-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'a1-garage-door-service';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'a1-garage-door-service';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'a1-garage-door-service';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'a1-garage-door-service';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'a1-garage-door-service';
INSERT INTO company_services (company_id, service) SELECT id, 'Emergency Service' FROM companies WHERE slug = 'a1-garage-door-service';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Grand Rapids' FROM companies WHERE slug = 'a1-garage-door-service';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Wyoming' FROM companies WHERE slug = 'a1-garage-door-service';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Kentwood' FROM companies WHERE slug = 'a1-garage-door-service';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Holland' FROM companies WHERE slug = 'a1-garage-door-service';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Muskegon' FROM companies WHERE slug = 'a1-garage-door-service';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Norton Shores' FROM companies WHERE slug = 'a1-garage-door-service';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Zeeland' FROM companies WHERE slug = 'a1-garage-door-service';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'a1-garage-door-service-detroit-mi-commerce-township',
  'A1 Garage Door Service - Detroit, MI',
  0.0, 0, 'Commerce Township, MI', 'commerce-township',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'A1 Garage Door Service - Detroit, MI provides garage door installation and service/repair in Commerce Township, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '833-653-2866', NULL,
  '2072 Winner Street, Commerce Township, MI 48390-3259', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-1-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'a1-garage-door-service-detroit-mi-commerce-township';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'a1-garage-door-service-detroit-mi-commerce-township';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'a1-garage-door-service-detroit-mi-commerce-township';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'a1-garage-door-service-detroit-mi-commerce-township';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'a1-garage-door-service-detroit-mi-commerce-township';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Commerce Township' FROM companies WHERE slug = 'a1-garage-door-service-detroit-mi-commerce-township';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'a1-garage-door-service-hudsonville-mi-hudsonville',
  'A1 Garage Door Service - Hudsonville, MI',
  0.0, 0, 'Hudsonville, MI', 'hudsonville',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'A1 Garage Door Service - Hudsonville, MI provides garage door installation and service/repair in Hudsonville, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '616-207-4676', NULL,
  '2874 Port Sheldon Street, Suite E, Hudsonville, MI 49426', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-1-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'a1-garage-door-service-hudsonville-mi-hudsonville';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'a1-garage-door-service-hudsonville-mi-hudsonville';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'a1-garage-door-service-hudsonville-mi-hudsonville';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'a1-garage-door-service-hudsonville-mi-hudsonville';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'a1-garage-door-service-hudsonville-mi-hudsonville';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Hudsonville' FROM companies WHERE slug = 'a1-garage-door-service-hudsonville-mi-hudsonville';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'a1-garage-door-service-lansing-mi-lansing',
  'A1 Garage Door Service - Lansing, MI',
  0.0, 0, 'Lansing, MI', 'lansing',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'A1 Garage Door Service - Lansing, MI provides garage door installation and service/repair in Lansing, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '866-466-1899', NULL,
  '815 West Edgewood Boulevard, Ste E, Lansing, MI 48911-7515', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-1-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'a1-garage-door-service-lansing-mi-lansing';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'a1-garage-door-service-lansing-mi-lansing';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'a1-garage-door-service-lansing-mi-lansing';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'a1-garage-door-service-lansing-mi-lansing';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'a1-garage-door-service-lansing-mi-lansing';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Lansing' FROM companies WHERE slug = 'a1-garage-door-service-lansing-mi-lansing';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'a1-garage-doors-kinross',
  'A1 Garage Doors',
  0.0, 0, 'Kinross, MI', 'kinross',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'A1 Garage Doors provides garage door installation and service/repair in Kinross, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '906-322-5637', NULL,
  '6241 W Kallio Rd, Kinross, MI 49752-9114', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-1-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'a1-garage-doors-kinross';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'a1-garage-doors-kinross';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'a1-garage-doors-kinross';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'a1-garage-doors-kinross';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'a1-garage-doors-kinross';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Kinross' FROM companies WHERE slug = 'a1-garage-doors-kinross';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'aaa-garage-door-repair-and-service-new-haven',
  'AAA Garage Door Repair and Service',
  4.9, 40, 'New Haven, MI', 'new-haven',
  '["Repair", "Installation"]',
  0, 0,
  'AAA Garage Door Repair and Service provides garage door installation and service/repair in New Haven, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '844-426-1588', NULL,
  '58596 Virginia Cir, New Haven, MI 48048', NULL,
  'https://www.google.com/maps/search/?api=1&query=AAA+Garage+Door+Repair+and+Service+58596+Virginia+Cir%2C+New+Haven%2C+MI+48048+Michigan', 'Current Business Index', 'High', 'Port Huron / St. Clair-Macomb', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'aaa-garage-door-repair-and-service-new-haven';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'aaa-garage-door-repair-and-service-new-haven';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'aaa-garage-door-repair-and-service-new-haven';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'aaa-garage-door-repair-and-service-new-haven';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'aaa-garage-door-repair-and-service-new-haven';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'New Haven' FROM companies WHERE slug = 'aaa-garage-door-repair-and-service-new-haven';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Port Huron' FROM companies WHERE slug = 'aaa-garage-door-repair-and-service-new-haven';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Clinton Township' FROM companies WHERE slug = 'aaa-garage-door-repair-and-service-new-haven';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Shelby Township' FROM companies WHERE slug = 'aaa-garage-door-repair-and-service-new-haven';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'accurate-garage-door-company-llc-newaygo',
  'Accurate Garage Door Company, LLC',
  5.0, 201, 'Newaygo, MI', 'newaygo',
  '["Repair", "Installation"]',
  0, 0,
  'Accurate Garage Door Company, LLC provides garage door installation and service/repair in Newaygo, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '231-224-6835', NULL,
  NULL, NULL,
  'https://www.google.com/maps/search/?api=1&query=Accurate+Garage+Door+Company%2C+LLC+Newaygo+Michigan', 'Current Business Index', 'High', 'Muskegon / Lakeshore', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'accurate-garage-door-company-llc-newaygo';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'accurate-garage-door-company-llc-newaygo';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'accurate-garage-door-company-llc-newaygo';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'accurate-garage-door-company-llc-newaygo';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'accurate-garage-door-company-llc-newaygo';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Newaygo' FROM companies WHERE slug = 'accurate-garage-door-company-llc-newaygo';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Muskegon' FROM companies WHERE slug = 'accurate-garage-door-company-llc-newaygo';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Norton Shores' FROM companies WHERE slug = 'accurate-garage-door-company-llc-newaygo';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Holland' FROM companies WHERE slug = 'accurate-garage-door-company-llc-newaygo';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'accurate-garage-door-services-kalkaska',
  'Accurate Garage Door Services',
  0.0, 0, 'Kalkaska, MI', 'kalkaska',
  '["Repair", "Installation"]',
  0, 0,
  'Accurate Garage Door Services provides garage door installation and service/repair in Kalkaska, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '231-886-8320', NULL,
  '8568 County Rd 612 NE, Kalkaska, MI 49646', NULL,
  'https://www.google.com/maps/search/?api=1&query=Accurate+Garage+Door+Services+8568+County+Rd+612+NE%2C+Kalkaska%2C+MI+49646+Michigan', 'Current Business Index', 'Medium', 'Traverse City / Northern Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'accurate-garage-door-services-kalkaska';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'accurate-garage-door-services-kalkaska';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'accurate-garage-door-services-kalkaska';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'accurate-garage-door-services-kalkaska';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'accurate-garage-door-services-kalkaska';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Kalkaska' FROM companies WHERE slug = 'accurate-garage-door-services-kalkaska';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Traverse City' FROM companies WHERE slug = 'accurate-garage-door-services-kalkaska';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Cadillac' FROM companies WHERE slug = 'accurate-garage-door-services-kalkaska';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Petoskey' FROM companies WHERE slug = 'accurate-garage-door-services-kalkaska';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'ace-garage-door-repair-howell',
  'ACE Garage Door Repair',
  5.0, 62, 'Howell, MI', 'howell',
  '["Repair", "Installation"]',
  0, 0,
  'ACE Garage Door Repair provides garage door installation and service/repair in Howell, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '734-474-5174', NULL,
  '3286 Nicolette Dr, Howell, MI 48843', NULL,
  'https://www.google.com/maps/search/?api=1&query=ACE+Garage+Door+Repair+3286+Nicolette+Dr%2C+Howell%2C+MI+48843+Michigan', 'Current Business Index', 'High', 'Jackson / South-Central Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'ace-garage-door-repair-howell';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'ace-garage-door-repair-howell';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'ace-garage-door-repair-howell';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'ace-garage-door-repair-howell';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'ace-garage-door-repair-howell';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Howell' FROM companies WHERE slug = 'ace-garage-door-repair-howell';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Jackson' FROM companies WHERE slug = 'ace-garage-door-repair-howell';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Battle Creek' FROM companies WHERE slug = 'ace-garage-door-repair-howell';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Ann Arbor' FROM companies WHERE slug = 'ace-garage-door-repair-howell';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'affordable-door-gate-grand-haven',
  'Affordable Door & Gate',
  0.0, 0, 'Grand Haven, MI', 'grand-haven',
  '["Repair", "Installation"]',
  0, 0,
  'Affordable Door & Gate provides garage door installation and service/repair in Grand Haven, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '616-819-8763', NULL,
  '14401 160th Ave, Grand Haven, MI 49417', NULL,
  'https://www.google.com/maps/search/?api=1&query=Affordable+Door+%26+Gate+14401+160th+Ave%2C+Grand+Haven%2C+MI+49417+Michigan', 'Current Business Index', 'Medium', 'Muskegon / Lakeshore', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'affordable-door-gate-grand-haven';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'affordable-door-gate-grand-haven';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'affordable-door-gate-grand-haven';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'affordable-door-gate-grand-haven';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'affordable-door-gate-grand-haven';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Grand Haven' FROM companies WHERE slug = 'affordable-door-gate-grand-haven';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Muskegon' FROM companies WHERE slug = 'affordable-door-gate-grand-haven';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Norton Shores' FROM companies WHERE slug = 'affordable-door-gate-grand-haven';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Holland' FROM companies WHERE slug = 'affordable-door-gate-grand-haven';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'ahlstrom-doors-spring-arbor',
  'Ahlstrom Doors',
  5.0, 16, 'Spring Arbor, MI', 'spring-arbor',
  '["Repair", "Installation"]',
  0, 0,
  'Ahlstrom Doors provides garage door installation and service/repair in Spring Arbor, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '517-414-3818', NULL,
  '3113 Earl Dr, Spring Arbor, MI 49283', NULL,
  'https://www.google.com/maps/search/?api=1&query=Ahlstrom+Doors+3113+Earl+Dr%2C+Spring+Arbor%2C+MI+49283+Michigan', 'Current Business Index', 'High', 'Jackson / South-Central Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'ahlstrom-doors-spring-arbor';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'ahlstrom-doors-spring-arbor';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'ahlstrom-doors-spring-arbor';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'ahlstrom-doors-spring-arbor';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'ahlstrom-doors-spring-arbor';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Spring Arbor' FROM companies WHERE slug = 'ahlstrom-doors-spring-arbor';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Jackson' FROM companies WHERE slug = 'ahlstrom-doors-spring-arbor';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Battle Creek' FROM companies WHERE slug = 'ahlstrom-doors-spring-arbor';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Ann Arbor' FROM companies WHERE slug = 'ahlstrom-doors-spring-arbor';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'ainsworth-door-inc-fort-gratiot',
  'Ainsworth Door Inc',
  4.9, 56, 'Fort Gratiot, MI', 'fort-gratiot',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'Ainsworth Door Inc provides garage door installation and service/repair in Fort Gratiot, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '810-385-5425', NULL,
  '3928 Krafft Rd, Fort Gratiot Township, MI 48059', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-1-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance. Cross-checked against a current 2026 business-index result. Clopay directory lists: 3888 North Road, Clyde, MI 48049-3936.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'ainsworth-door-inc-fort-gratiot';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'ainsworth-door-inc-fort-gratiot';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'ainsworth-door-inc-fort-gratiot';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'ainsworth-door-inc-fort-gratiot';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'ainsworth-door-inc-fort-gratiot';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Fort Gratiot' FROM companies WHERE slug = 'ainsworth-door-inc-fort-gratiot';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'ais-garage-door-repair',
  'AIS Garage Door Repair',
  4.4, 25, 'Detroit, MI', 'detroit',
  '["Repair", "Openers", "Installation"]',
  0, 0,
  'AIS Garage Door Repair serves Detroit-area homeowners with garage door repair, opener installation, and track and spring service.',
  'Mon–Fri, 8am–6pm', NULL, NULL, NULL,
  NULL, NULL,
  NULL, NULL, NULL, NULL, NULL,
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'ais-garage-door-repair';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'ais-garage-door-repair';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'ais-garage-door-repair';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'ais-garage-door-repair';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'ais-garage-door-repair';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Detroit' FROM companies WHERE slug = 'ais-garage-door-repair';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Dearborn' FROM companies WHERE slug = 'ais-garage-door-repair';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Warren' FROM companies WHERE slug = 'ais-garage-door-repair';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Southfield' FROM companies WHERE slug = 'ais-garage-door-repair';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'all-american-garage-doors-lansing',
  'All American Garage Doors',
  5.0, 20, 'Lansing, MI', 'lansing',
  '["Repair", "Installation"]',
  0, 0,
  'All American Garage Doors provides garage door installation and service/repair in Lansing, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '517-974-4020', NULL,
  NULL, NULL,
  'https://www.google.com/maps/search/?api=1&query=All+American+Garage+Doors+Lansing+Michigan', 'Current Business Index', 'High', 'Lansing / Mid-Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'all-american-garage-doors-lansing';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'all-american-garage-doors-lansing';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'all-american-garage-doors-lansing';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'all-american-garage-doors-lansing';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'all-american-garage-doors-lansing';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Lansing' FROM companies WHERE slug = 'all-american-garage-doors-lansing';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'East Lansing' FROM companies WHERE slug = 'all-american-garage-doors-lansing';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Jackson' FROM companies WHERE slug = 'all-american-garage-doors-lansing';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'all-day-garage-door-services',
  'All Day Garage Door Services',
  5.0, 20, 'Interlochen, MI', 'traverse-city',
  '["Repair", "Installation", "Openers"]',
  0, 0,
  'All Day Garage Door Services is a family-owned Interlochen company serving Traverse City and surrounding communities with residential and commercial garage door sales, installation, openers, and certified technician repairs.',
  'Mon–Sat, 9am–5pm', NULL, '231-392-9483', NULL,
  '2488 Fashion Ave, Interlochen, MI 49643', NULL,
  'https://www.google.com/maps/search/?api=1&query=All+Day+Garage+Door+Services+LLC+2488+Fashion+Ave%2C+Interlochen%2C+MI+49643+Michigan', 'Current Business Index', 'Medium', 'Traverse City / Northern Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'all-day-garage-door-services';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'all-day-garage-door-services';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'all-day-garage-door-services';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'all-day-garage-door-services';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'all-day-garage-door-services';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Interlochen' FROM companies WHERE slug = 'all-day-garage-door-services';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Traverse City' FROM companies WHERE slug = 'all-day-garage-door-services';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Kingsley' FROM companies WHERE slug = 'all-day-garage-door-services';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Cadillac' FROM companies WHERE slug = 'all-day-garage-door-services';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Frankfort' FROM companies WHERE slug = 'all-day-garage-door-services';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'almont-door-co-almont',
  'Almont Door Co',
  0.0, 0, 'Almont, MI', 'almont',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'Almont Door Co provides garage door installation and service/repair in Almont, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '810-798-2468', NULL,
  '8200 Hollow Corners Rd, Almont, MI 48003-8145', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-1-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'almont-door-co-almont';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'almont-door-co-almont';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'almont-door-co-almont';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'almont-door-co-almont';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'almont-door-co-almont';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Almont' FROM companies WHERE slug = 'almont-door-co-almont';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'altech-doors-livonia',
  'Altech Doors',
  0.0, 0, 'Livonia, MI', 'livonia',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'Altech Doors provides garage door installation and service/repair in Livonia, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '734-525-0875', NULL,
  '27519 Schoolcraft Rd, Livonia, MI 48150-2217', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-1-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'altech-doors-livonia';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'altech-doors-livonia';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'altech-doors-livonia';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'altech-doors-livonia';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'altech-doors-livonia';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Livonia' FROM companies WHERE slug = 'altech-doors-livonia';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'am-door-avoca',
  'Am Door',
  0.0, 0, 'Avoca, MI', 'avoca',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'Am Door provides garage door installation and service/repair in Avoca, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '810-531-0922', NULL,
  '9210 IMLAY CITY ROAD, AVOCA, MI 48006-3516', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-1-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'am-door-avoca';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'am-door-avoca';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'am-door-avoca';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'am-door-avoca';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'am-door-avoca';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Avoca' FROM companies WHERE slug = 'am-door-avoca';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'aman-garage-door-repair-ann-arbor',
  'Aman Garage Door Repair',
  5.0, 154, 'Ann Arbor, MI', 'ann-arbor',
  '["Repair", "Installation"]',
  0, 0,
  'Aman Garage Door Repair provides garage door installation and service/repair in Ann Arbor, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '734-579-8440', NULL,
  '2315 Jonathan Ct, Ann Arbor, MI 48108', NULL,
  'https://www.google.com/maps/search/?api=1&query=Aman+Garage+Door+Repair+2315+Jonathan+Ct%2C+Ann+Arbor%2C+MI+48108+Michigan', 'Current Business Index', 'High', 'Ann Arbor / Livingston', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'aman-garage-door-repair-ann-arbor';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'aman-garage-door-repair-ann-arbor';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'aman-garage-door-repair-ann-arbor';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'aman-garage-door-repair-ann-arbor';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'aman-garage-door-repair-ann-arbor';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Ann Arbor' FROM companies WHERE slug = 'aman-garage-door-repair-ann-arbor';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Ypsilanti' FROM companies WHERE slug = 'aman-garage-door-repair-ann-arbor';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Brighton' FROM companies WHERE slug = 'aman-garage-door-repair-ann-arbor';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Howell' FROM companies WHERE slug = 'aman-garage-door-repair-ann-arbor';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'ann-arbor-door-systems',
  'Ann Arbor Door Systems',
  4.7, 88, 'Ann Arbor, MI', 'ann-arbor',
  '["Repair", "Installation", "Openers"]',
  0, 0,
  'Ann Arbor Door Systems serves Washtenaw County homeowners with garage door repair, opener service, and new door installation.',
  'Mon–Fri, 8am–5pm', NULL, '734-954-4278', NULL,
  '2200 S Industrial Hwy Ste E, Ann Arbor, MI 48104', NULL,
  'https://www.google.com/maps/search/?api=1&query=Ann+Arbor+Door+Systems+2200+S+Industrial+Hwy+Ste+E%2C+Ann+Arbor%2C+MI+48104+Michigan', 'Current Business Index', 'High', 'Ann Arbor / Livingston', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'ann-arbor-door-systems';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'ann-arbor-door-systems';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'ann-arbor-door-systems';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'ann-arbor-door-systems';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'ann-arbor-door-systems';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Ann Arbor' FROM companies WHERE slug = 'ann-arbor-door-systems';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Ypsilanti' FROM companies WHERE slug = 'ann-arbor-door-systems';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Saline' FROM companies WHERE slug = 'ann-arbor-door-systems';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Dexter' FROM companies WHERE slug = 'ann-arbor-door-systems';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Chelsea' FROM companies WHERE slug = 'ann-arbor-door-systems';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'arcadia-garage-door-company-llc-mattawan',
  'Arcadia Garage Door Company LLC',
  5.0, 14, 'Mattawan, MI', 'mattawan',
  '["Repair", "Installation"]',
  0, 0,
  'Arcadia Garage Door Company LLC provides garage door installation and service/repair in Mattawan, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '269-377-6089', NULL,
  '7267 S 3rd St, Mattawan, MI 49071', NULL,
  'https://www.google.com/maps/search/?api=1&query=Arcadia+Garage+Door+Company+LLC+7267+S+3rd+St%2C+Mattawan%2C+MI+49071+Michigan', 'Current Business Index', 'High', 'Kalamazoo / Southwest Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'arcadia-garage-door-company-llc-mattawan';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'arcadia-garage-door-company-llc-mattawan';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'arcadia-garage-door-company-llc-mattawan';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'arcadia-garage-door-company-llc-mattawan';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'arcadia-garage-door-company-llc-mattawan';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Mattawan' FROM companies WHERE slug = 'arcadia-garage-door-company-llc-mattawan';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Kalamazoo' FROM companies WHERE slug = 'arcadia-garage-door-company-llc-mattawan';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Portage' FROM companies WHERE slug = 'arcadia-garage-door-company-llc-mattawan';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Battle Creek' FROM companies WHERE slug = 'arcadia-garage-door-company-llc-mattawan';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'asap-garage-door-repair-systems-of-michigan-clinton',
  'ASAP Garage Door Repair Systems of Michigan',
  4.6, 11, 'Clinton Township, MI', 'clinton-township',
  '["Repair", "Installation"]',
  0, 0,
  'ASAP Garage Door Repair Systems of Michigan provides garage door installation and service/repair in Clinton Township, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '586-799-2763', NULL,
  '38442 Meadowdale St, Charter Township of Clinton, MI 48036', NULL,
  'https://www.google.com/maps/search/?api=1&query=ASAP+Garage+Door+Repair+Systems+of+Michigan+38442+Meadowdale+St%2C+Charter+Township+of+Clinton%2C+MI+48036+Michigan', 'Current Business Index', 'High', 'Port Huron / St. Clair-Macomb', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'asap-garage-door-repair-systems-of-michigan-clinton';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'asap-garage-door-repair-systems-of-michigan-clinton';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'asap-garage-door-repair-systems-of-michigan-clinton';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'asap-garage-door-repair-systems-of-michigan-clinton';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'asap-garage-door-repair-systems-of-michigan-clinton';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Clinton Township' FROM companies WHERE slug = 'asap-garage-door-repair-systems-of-michigan-clinton';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Port Huron' FROM companies WHERE slug = 'asap-garage-door-repair-systems-of-michigan-clinton';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Shelby Township' FROM companies WHERE slug = 'asap-garage-door-repair-systems-of-michigan-clinton';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'attica-overhead-door-attica',
  'Attica Overhead Door',
  4.9, 32, 'Attica, MI', 'attica',
  '["Repair", "Installation"]',
  0, 0,
  'Attica Overhead Door provides garage door installation and service/repair in Attica, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '810-683-4098', NULL,
  '5161 Lum Rd, Attica, MI 48412', NULL,
  'https://www.google.com/maps/search/?api=1&query=Attica+Overhead+Door+5161+Lum+Rd%2C+Attica%2C+MI+48412+Michigan', 'Current Business Index', 'High', 'Flint / Genesee / Lapeer', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'attica-overhead-door-attica';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'attica-overhead-door-attica';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'attica-overhead-door-attica';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'attica-overhead-door-attica';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'attica-overhead-door-attica';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Attica' FROM companies WHERE slug = 'attica-overhead-door-attica';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Flint' FROM companies WHERE slug = 'attica-overhead-door-attica';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Grand Blanc' FROM companies WHERE slug = 'attica-overhead-door-attica';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Fenton' FROM companies WHERE slug = 'attica-overhead-door-attica';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'bb-garage-doors-and-more',
  'B&B Garage Doors and More',
  4.9, 76, 'Traverse City, MI', 'traverse-city',
  '["Repair", "Installation", "Emergency"]',
  0, 1,
  'B&B Garage Doors and More is a family-owned, licensed, and insured Traverse City company serving Grand Traverse, Leelanau, Benzie, Antrim, and Kalkaska counties with residential and commercial garage door installation and repair.',
  'Mon–Sat, 7am–6pm', 'Call for emergency availability', '231-360-5442', NULL,
  '3890 S Blue Star Dr Ste A, Traverse City, MI 49685', 'https://www.bbgaragedoorsandmore.com/',
  'https://www.google.com/maps/search/?api=1&query=B%26B+Garage+Doors+and+More+3890+S+Blue+Star+Dr+Ste+A%2C+Traverse+City%2C+MI+49685+Michigan', 'Current Business Index', 'High', 'Traverse City / Northern Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'bb-garage-doors-and-more';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'bb-garage-doors-and-more';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'bb-garage-doors-and-more';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'bb-garage-doors-and-more';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'bb-garage-doors-and-more';
INSERT INTO company_services (company_id, service) SELECT id, 'Emergency Service' FROM companies WHERE slug = 'bb-garage-doors-and-more';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Traverse City' FROM companies WHERE slug = 'bb-garage-doors-and-more';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Cadillac' FROM companies WHERE slug = 'bb-garage-doors-and-more';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Petoskey' FROM companies WHERE slug = 'bb-garage-doors-and-more';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Charlevoix' FROM companies WHERE slug = 'bb-garage-doors-and-more';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Gaylord' FROM companies WHERE slug = 'bb-garage-doors-and-more';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Interlochen' FROM companies WHERE slug = 'bb-garage-doors-and-more';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Kingsley' FROM companies WHERE slug = 'bb-garage-doors-and-more';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'barnsmiths-llc-three-rivers',
  'Barnsmiths LLC',
  0.0, 0, 'Three Rivers, MI', 'three-rivers',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'Barnsmiths LLC provides garage door installation and service/repair in Three Rivers, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '408-772-5064', NULL,
  '14430 Hoffman Road, Three Rivers, MI 49093-9703', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-1-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'barnsmiths-llc-three-rivers';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'barnsmiths-llc-three-rivers';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'barnsmiths-llc-three-rivers';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'barnsmiths-llc-three-rivers';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'barnsmiths-llc-three-rivers';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Three Rivers' FROM companies WHERE slug = 'barnsmiths-llc-three-rivers';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'battle-creek-door-company',
  'Battle Creek Door Company',
  4.7, 44, 'Battle Creek, MI', 'battle-creek',
  '["Repair", "Installation", "Maintenance", "Clopay Dealer"]',
  0, 0,
  'Battle Creek Door Company serves Calhoun County with residential garage door repair, installation, and maintenance.',
  'Mon–Fri, 8am–5pm', NULL, '269-962-5502', NULL,
  '12200 E MICHIGAN AVENUE, BATTLE CREEK, MI 49014-7991', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-2-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'battle-creek-door-company';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'battle-creek-door-company';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'battle-creek-door-company';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'battle-creek-door-company';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'battle-creek-door-company';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Battle Creek' FROM companies WHERE slug = 'battle-creek-door-company';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Kalamazoo' FROM companies WHERE slug = 'battle-creek-door-company';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Portage' FROM companies WHERE slug = 'battle-creek-door-company';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Marshall' FROM companies WHERE slug = 'battle-creek-door-company';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'beckway-door',
  'Beckway Door',
  4.8, 72, 'Ann Arbor, MI', 'ann-arbor',
  '["Repair", "Installation", "Commercial"]',
  0, 0,
  'Beckway Door provides residential and commercial overhead door service for Ann Arbor and surrounding Southeast Michigan communities.',
  'Mon–Fri, 7am–5pm', NULL, NULL, NULL,
  NULL, NULL,
  NULL, NULL, NULL, NULL, NULL,
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'beckway-door';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'beckway-door';
INSERT INTO company_services (company_id, service) SELECT id, 'Commercial Service' FROM companies WHERE slug = 'beckway-door';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'beckway-door';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'beckway-door';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'beckway-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Ann Arbor' FROM companies WHERE slug = 'beckway-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Ypsilanti' FROM companies WHERE slug = 'beckway-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Canton' FROM companies WHERE slug = 'beckway-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Plymouth' FROM companies WHERE slug = 'beckway-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Livonia' FROM companies WHERE slug = 'beckway-door';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'beckway-door-south-lyon',
  'Beckway Door',
  0.0, 0, 'South Lyon, MI', 'south-lyon',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'Beckway Door provides garage door installation and service/repair in South Lyon, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '248-486-3667', NULL,
  '505 East Lake Street, South Lyon, MI 48178-2124', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-1-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'beckway-door-south-lyon';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'beckway-door-south-lyon';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'beckway-door-south-lyon';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'beckway-door-south-lyon';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'beckway-door-south-lyon';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'South Lyon' FROM companies WHERE slug = 'beckway-door-south-lyon';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'ben-s-garage-door-repair-redford',
  'Ben’S Garage Door Repair',
  5.0, 400, 'Redford, MI', 'redford',
  '["Repair", "Installation"]',
  0, 0,
  'Ben’S Garage Door Repair provides garage door installation and service/repair in Redford, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '313-600-2151', NULL,
  NULL, NULL,
  'https://www.google.com/maps/search/?api=1&query=BEN%E2%80%99S+GARAGE+DOOR+REPAIR+Redford+Michigan', 'Current Business Index', 'High', 'Detroit / Southeast Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'ben-s-garage-door-repair-redford';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'ben-s-garage-door-repair-redford';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'ben-s-garage-door-repair-redford';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'ben-s-garage-door-repair-redford';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'ben-s-garage-door-repair-redford';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Redford' FROM companies WHERE slug = 'ben-s-garage-door-repair-redford';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Detroit' FROM companies WHERE slug = 'ben-s-garage-door-repair-redford';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Warren' FROM companies WHERE slug = 'ben-s-garage-door-repair-redford';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Dearborn' FROM companies WHERE slug = 'ben-s-garage-door-repair-redford';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Livonia' FROM companies WHERE slug = 'ben-s-garage-door-repair-redford';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'bj-s-garage-doors-inc-grand-blanc',
  'BJ''s Garage Doors Inc.',
  5.0, 154, 'Grand Blanc, MI', 'grand-blanc',
  '["Repair", "Installation"]',
  0, 0,
  'BJ''s Garage Doors Inc. provides garage door installation and service/repair in Grand Blanc, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '810-442-7243', NULL,
  NULL, NULL,
  'https://www.google.com/maps/search/?api=1&query=BJ%27s+Garage+Doors+Inc.+Grand+Blanc+Michigan', 'Current Business Index', 'High', 'Flint / Genesee / Lapeer', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'bj-s-garage-doors-inc-grand-blanc';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'bj-s-garage-doors-inc-grand-blanc';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'bj-s-garage-doors-inc-grand-blanc';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'bj-s-garage-doors-inc-grand-blanc';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'bj-s-garage-doors-inc-grand-blanc';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Grand Blanc' FROM companies WHERE slug = 'bj-s-garage-doors-inc-grand-blanc';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Flint' FROM companies WHERE slug = 'bj-s-garage-doors-inc-grand-blanc';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Fenton' FROM companies WHERE slug = 'bj-s-garage-doors-inc-grand-blanc';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'blitz-garage-door-repair-ann-arbor',
  'Blitz Garage Door Repair',
  4.9, 210, 'Ann Arbor, MI', 'ann-arbor',
  '["Repair", "Installation"]',
  0, 0,
  'Blitz Garage Door Repair provides garage door installation and service/repair in Ann Arbor, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '313-479-2092', NULL,
  '326-330 S State St #208, Ann Arbor, MI 48104', NULL,
  'https://www.google.com/maps/search/?api=1&query=Blitz+Garage+Door+Repair+326-330+S+State+St+%23208%2C+Ann+Arbor%2C+MI+48104+Michigan', 'Current Business Index', 'High', 'Ann Arbor / Livingston', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'blitz-garage-door-repair-ann-arbor';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'blitz-garage-door-repair-ann-arbor';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'blitz-garage-door-repair-ann-arbor';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'blitz-garage-door-repair-ann-arbor';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'blitz-garage-door-repair-ann-arbor';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Ann Arbor' FROM companies WHERE slug = 'blitz-garage-door-repair-ann-arbor';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Ypsilanti' FROM companies WHERE slug = 'blitz-garage-door-repair-ann-arbor';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Brighton' FROM companies WHERE slug = 'blitz-garage-door-repair-ann-arbor';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Howell' FROM companies WHERE slug = 'blitz-garage-door-repair-ann-arbor';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'blitz-garage-door-repair',
  'Blitz Garage Door Repair',
  5.0, 14, 'Grand Rapids, MI', 'grand-rapids',
  '["Repair", "Springs", "Emergency"]',
  0, 1,
  'Blitz Garage Door Repair is a Grand Rapids residential repair specialist focused on springs, cables, and same-day fixes.',
  'Mon–Sat, 7am–7pm', 'Same-day when available', NULL, NULL,
  NULL, NULL,
  NULL, NULL, NULL, NULL, NULL,
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'blitz-garage-door-repair';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'blitz-garage-door-repair';
INSERT INTO company_services (company_id, service) SELECT id, 'Emergency Service' FROM companies WHERE slug = 'blitz-garage-door-repair';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Grand Rapids' FROM companies WHERE slug = 'blitz-garage-door-repair';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Wyoming' FROM companies WHERE slug = 'blitz-garage-door-repair';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Kentwood' FROM companies WHERE slug = 'blitz-garage-door-repair';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'blitz-garage-door-repair-kalamazoo',
  'Blitz Garage Door Repair',
  5.0, 80, 'Kalamazoo, MI', 'kalamazoo',
  '["Repair", "Installation"]',
  0, 0,
  'Blitz Garage Door Repair provides garage door installation and service/repair in Kalamazoo, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '269-230-3297', NULL,
  '3651 Midlink Dr, Kalamazoo, MI 49001', NULL,
  'https://www.google.com/maps/search/?api=1&query=Blitz+Garage+Door+Repair+3651+Midlink+Dr%2C+Kalamazoo%2C+MI+49001+Michigan', 'Current Business Index', 'High', 'Kalamazoo / Southwest Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'blitz-garage-door-repair-kalamazoo';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'blitz-garage-door-repair-kalamazoo';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'blitz-garage-door-repair-kalamazoo';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'blitz-garage-door-repair-kalamazoo';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'blitz-garage-door-repair-kalamazoo';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Kalamazoo' FROM companies WHERE slug = 'blitz-garage-door-repair-kalamazoo';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Portage' FROM companies WHERE slug = 'blitz-garage-door-repair-kalamazoo';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Battle Creek' FROM companies WHERE slug = 'blitz-garage-door-repair-kalamazoo';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'blitz-garage-door-repair-norton-shores',
  'Blitz Garage Door Repair',
  4.9, 201, 'Norton Shores, MI', 'norton-shores',
  '["Repair", "Installation"]',
  0, 0,
  'Blitz Garage Door Repair provides garage door installation and service/repair in Norton Shores, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '231-247-8140', NULL,
  '3570 Henry St, Norton Shores, MI 49441', NULL,
  'https://www.google.com/maps/search/?api=1&query=Blitz+Garage+Door+Repair+3570+Henry+St%2C+Norton+Shores%2C+MI+49441+Michigan', 'Current Business Index', 'High', 'Muskegon / Lakeshore', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'blitz-garage-door-repair-norton-shores';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'blitz-garage-door-repair-norton-shores';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'blitz-garage-door-repair-norton-shores';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'blitz-garage-door-repair-norton-shores';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'blitz-garage-door-repair-norton-shores';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Norton Shores' FROM companies WHERE slug = 'blitz-garage-door-repair-norton-shores';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Muskegon' FROM companies WHERE slug = 'blitz-garage-door-repair-norton-shores';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Holland' FROM companies WHERE slug = 'blitz-garage-door-repair-norton-shores';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'blitz-garage-door-repair-port-huron',
  'Blitz Garage Door Repair',
  5.0, 337, 'Port Huron, MI', 'port-huron',
  '["Repair", "Installation"]',
  0, 0,
  'Blitz Garage Door Repair provides garage door installation and service/repair in Port Huron, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '810-356-5803', NULL,
  '3506 Pine Grove Ave, Port Huron, MI 48060', NULL,
  'https://www.google.com/maps/search/?api=1&query=Blitz+Garage+Door+Repair+3506+Pine+Grove+Ave%2C+Port+Huron%2C+MI+48060+Michigan', 'Current Business Index', 'High', 'Port Huron / St. Clair-Macomb', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'blitz-garage-door-repair-port-huron';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'blitz-garage-door-repair-port-huron';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'blitz-garage-door-repair-port-huron';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'blitz-garage-door-repair-port-huron';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'blitz-garage-door-repair-port-huron';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Port Huron' FROM companies WHERE slug = 'blitz-garage-door-repair-port-huron';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Clinton Township' FROM companies WHERE slug = 'blitz-garage-door-repair-port-huron';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Shelby Township' FROM companies WHERE slug = 'blitz-garage-door-repair-port-huron';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'blitz-garage-door-repair-saginaw',
  'Blitz Garage Door Repair',
  4.9, 108, 'Saginaw, MI', 'saginaw',
  '["Repair", "Installation"]',
  0, 0,
  'Blitz Garage Door Repair provides garage door installation and service/repair in Saginaw, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '989-208-2886', NULL,
  '8390 Gratiot Rd #12, Saginaw, MI 48609', NULL,
  'https://www.google.com/maps/search/?api=1&query=Blitz+Garage+Door+Repair+8390+Gratiot+Rd+%2312%2C+Saginaw%2C+MI+48609+Michigan', 'Current Business Index', 'High', 'Saginaw / Great Lakes Bay', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'blitz-garage-door-repair-saginaw';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'blitz-garage-door-repair-saginaw';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'blitz-garage-door-repair-saginaw';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'blitz-garage-door-repair-saginaw';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'blitz-garage-door-repair-saginaw';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Saginaw' FROM companies WHERE slug = 'blitz-garage-door-repair-saginaw';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Bay City' FROM companies WHERE slug = 'blitz-garage-door-repair-saginaw';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Midland' FROM companies WHERE slug = 'blitz-garage-door-repair-saginaw';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'blitz-garage-door-repair-west-bloomfield',
  'Blitz Garage Door Repair',
  5.0, 2820, 'West Bloomfield, MI', 'west-bloomfield',
  '["Repair", "Installation"]',
  0, 0,
  'Blitz Garage Door Repair provides garage door installation and service/repair in West Bloomfield, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '888-422-3152', NULL,
  NULL, NULL,
  'https://www.google.com/maps/search/?api=1&query=Blitz+Garage+Door+Repair+West+Bloomfield+Michigan', 'Current Business Index', 'High', 'Detroit / Southeast Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'blitz-garage-door-repair-west-bloomfield';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'blitz-garage-door-repair-west-bloomfield';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'blitz-garage-door-repair-west-bloomfield';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'blitz-garage-door-repair-west-bloomfield';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'blitz-garage-door-repair-west-bloomfield';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'West Bloomfield' FROM companies WHERE slug = 'blitz-garage-door-repair-west-bloomfield';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Detroit' FROM companies WHERE slug = 'blitz-garage-door-repair-west-bloomfield';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Warren' FROM companies WHERE slug = 'blitz-garage-door-repair-west-bloomfield';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Dearborn' FROM companies WHERE slug = 'blitz-garage-door-repair-west-bloomfield';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Livonia' FROM companies WHERE slug = 'blitz-garage-door-repair-west-bloomfield';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'blue-water-door-fort-gratiot',
  'Blue Water Door',
  4.8, 4, 'Fort Gratiot, MI', 'fort-gratiot',
  '["Repair", "Installation"]',
  0, 0,
  'Blue Water Door provides garage door installation and service/repair in Fort Gratiot, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '810-985-6771', NULL,
  '4146 N River Rd, Fort Gratiot Township, MI 48059', NULL,
  'https://www.google.com/maps/search/?api=1&query=Blue+Water+Door+4146+N+River+Rd%2C+Fort+Gratiot+Township%2C+MI+48059+Michigan', 'Current Business Index', 'Medium', 'Port Huron / St. Clair-Macomb', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'blue-water-door-fort-gratiot';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'blue-water-door-fort-gratiot';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'blue-water-door-fort-gratiot';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'blue-water-door-fort-gratiot';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'blue-water-door-fort-gratiot';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Fort Gratiot' FROM companies WHERE slug = 'blue-water-door-fort-gratiot';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Port Huron' FROM companies WHERE slug = 'blue-water-door-fort-gratiot';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Clinton Township' FROM companies WHERE slug = 'blue-water-door-fort-gratiot';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Shelby Township' FROM companies WHERE slug = 'blue-water-door-fort-gratiot';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'bouma-bros-garage-doors',
  'Bouma Bros Garage Doors',
  4.6, 126, 'Wyoming, MI', 'wyoming',
  '["Repair", "Installation", "Openers"]',
  0, 0,
  'Bouma Bros Garage Doors is a Wyoming-based family company serving West Michigan with residential garage door repair and installation.',
  'Mon–Fri, 7am–5pm', NULL, NULL, NULL,
  NULL, NULL,
  NULL, NULL, NULL, NULL, NULL,
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'bouma-bros-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'bouma-bros-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'bouma-bros-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'bouma-bros-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'bouma-bros-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Wyoming' FROM companies WHERE slug = 'bouma-bros-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Grand Rapids' FROM companies WHERE slug = 'bouma-bros-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Grandville' FROM companies WHERE slug = 'bouma-bros-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Byron Center' FROM companies WHERE slug = 'bouma-bros-garage-doors';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'brighton-howell-garage-doors',
  'Brighton & Howell Garage Doors',
  4.8, 59, 'Brighton, MI', 'brighton',
  '["Repair", "Installation", "Openers"]',
  0, 0,
  'Brighton & Howell Garage Doors serves Livingston County homeowners with repair, opener service, and new door installation.',
  'Mon–Sat, 7am–6pm', NULL, NULL, NULL,
  NULL, NULL,
  NULL, NULL, NULL, NULL, NULL,
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'brighton-howell-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'brighton-howell-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'brighton-howell-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'brighton-howell-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'brighton-howell-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Brighton' FROM companies WHERE slug = 'brighton-howell-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Howell' FROM companies WHERE slug = 'brighton-howell-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Milford' FROM companies WHERE slug = 'brighton-howell-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Ann Arbor' FROM companies WHERE slug = 'brighton-howell-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Novi' FROM companies WHERE slug = 'brighton-howell-garage-doors';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'bulldog-garage-doors-petoskey',
  'Bulldog Garage Doors',
  5.0, 11, 'Petoskey, MI', 'petoskey',
  '["Repair", "Installation"]',
  0, 0,
  'Bulldog Garage Doors provides garage door installation and service/repair in Petoskey, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '231-550-2364', NULL,
  '1313 Anderson Rd, Petoskey, MI 49770', NULL,
  'https://www.google.com/maps/search/?api=1&query=Bulldog+Garage+Doors+1313+Anderson+Rd%2C+Petoskey%2C+MI+49770+Michigan', 'Current Business Index', 'High', 'Traverse City / Northern Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'bulldog-garage-doors-petoskey';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'bulldog-garage-doors-petoskey';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'bulldog-garage-doors-petoskey';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'bulldog-garage-doors-petoskey';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'bulldog-garage-doors-petoskey';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Petoskey' FROM companies WHERE slug = 'bulldog-garage-doors-petoskey';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Traverse City' FROM companies WHERE slug = 'bulldog-garage-doors-petoskey';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Cadillac' FROM companies WHERE slug = 'bulldog-garage-doors-petoskey';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'cadillac-grand-traverse-garage-door',
  'Cadillac & Grand Traverse Garage Door',
  4.6, 61, 'Traverse City, MI', 'traverse-city',
  '["Repair", "Installation", "Openers", "Commercial"]',
  0, 0,
  'Cadillac & Grand Traverse Garage Door is a family-owned Northern Michigan company since 1982 with locations in Traverse City and Cadillac. They install and repair Garaga and Wayne Dalton residential, agricultural, commercial, and industrial doors.',
  'Mon–Fri, 8am–5pm', NULL, NULL, NULL,
  NULL, 'https://michigangaragedoor.com/',
  NULL, NULL, NULL, NULL, NULL,
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'cadillac-grand-traverse-garage-door';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'cadillac-grand-traverse-garage-door';
INSERT INTO company_services (company_id, service) SELECT id, 'Commercial Service' FROM companies WHERE slug = 'cadillac-grand-traverse-garage-door';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'cadillac-grand-traverse-garage-door';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'cadillac-grand-traverse-garage-door';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'cadillac-grand-traverse-garage-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Traverse City' FROM companies WHERE slug = 'cadillac-grand-traverse-garage-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Cadillac' FROM companies WHERE slug = 'cadillac-grand-traverse-garage-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Kalkaska' FROM companies WHERE slug = 'cadillac-grand-traverse-garage-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Petoskey' FROM companies WHERE slug = 'cadillac-grand-traverse-garage-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Frankfort' FROM companies WHERE slug = 'cadillac-grand-traverse-garage-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Mount Pleasant' FROM companies WHERE slug = 'cadillac-grand-traverse-garage-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Gaylord' FROM companies WHERE slug = 'cadillac-grand-traverse-garage-door';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'caleb-s-garage-door-service-eaton-rapids',
  'Caleb''s Garage Door Service',
  5.0, 44, 'Eaton Rapids, MI', 'eaton-rapids',
  '["Repair", "Installation"]',
  0, 0,
  'Caleb''s Garage Door Service provides garage door installation and service/repair in Eaton Rapids, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '517-983-0011', NULL,
  NULL, NULL,
  'https://www.google.com/maps/search/?api=1&query=Caleb%27s+Garage+Door+Service+Eaton+Rapids+Michigan', 'Current Business Index', 'High', 'Lansing / Mid-Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'caleb-s-garage-door-service-eaton-rapids';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'caleb-s-garage-door-service-eaton-rapids';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'caleb-s-garage-door-service-eaton-rapids';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'caleb-s-garage-door-service-eaton-rapids';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'caleb-s-garage-door-service-eaton-rapids';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Eaton Rapids' FROM companies WHERE slug = 'caleb-s-garage-door-service-eaton-rapids';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Lansing' FROM companies WHERE slug = 'caleb-s-garage-door-service-eaton-rapids';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'East Lansing' FROM companies WHERE slug = 'caleb-s-garage-door-service-eaton-rapids';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Jackson' FROM companies WHERE slug = 'caleb-s-garage-door-service-eaton-rapids';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'calumet-building-group-ltd-grand-rapids',
  'Calumet Building Group Ltd',
  0.0, 0, 'Grand Rapids, MI', 'grand-rapids',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'Calumet Building Group Ltd provides garage door installation and service/repair in Grand Rapids, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '616-261-0500', NULL,
  '5761 North Hawkeye Ct SW, Grand Rapids, MI 49509-9534', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-1-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'calumet-building-group-ltd-grand-rapids';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'calumet-building-group-ltd-grand-rapids';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'calumet-building-group-ltd-grand-rapids';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'calumet-building-group-ltd-grand-rapids';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'calumet-building-group-ltd-grand-rapids';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Grand Rapids' FROM companies WHERE slug = 'calumet-building-group-ltd-grand-rapids';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'campbell-s-garage-door-llc-flint',
  'Campbell''s Garage Door LLC',
  5.0, 19, 'Flint, MI', 'flint',
  '["Repair", "Installation"]',
  0, 0,
  'Campbell''s Garage Door LLC provides garage door installation and service/repair in Flint, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '810-686-1118', NULL,
  '7050 Lewis St, Flint, MI 48506', NULL,
  'https://www.google.com/maps/search/?api=1&query=Campbell%27s+Garage+Door+LLC+7050+Lewis+St%2C+Flint%2C+MI+48506+Michigan', 'Current Business Index', 'High', 'Flint / Genesee / Lapeer', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'campbell-s-garage-door-llc-flint';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'campbell-s-garage-door-llc-flint';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'campbell-s-garage-door-llc-flint';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'campbell-s-garage-door-llc-flint';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'campbell-s-garage-door-llc-flint';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Flint' FROM companies WHERE slug = 'campbell-s-garage-door-llc-flint';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Grand Blanc' FROM companies WHERE slug = 'campbell-s-garage-door-llc-flint';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Fenton' FROM companies WHERE slug = 'campbell-s-garage-door-llc-flint';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'capital-city-garage-doors',
  'Capital City Garage Doors',
  4.8, 96, 'Lansing, MI', 'lansing',
  '["Repair", "Springs", "Openers"]',
  0, 0,
  'Capital City Garage Doors serves Lansing and mid-Michigan with residential repair, spring replacement, and opener service.',
  'Mon–Sat, 7am–6pm', NULL, NULL, NULL,
  NULL, NULL,
  NULL, NULL, NULL, NULL, NULL,
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'capital-city-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'capital-city-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'capital-city-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'capital-city-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'capital-city-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Lansing' FROM companies WHERE slug = 'capital-city-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'East Lansing' FROM companies WHERE slug = 'capital-city-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Okemos' FROM companies WHERE slug = 'capital-city-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Holt' FROM companies WHERE slug = 'capital-city-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Grand Ledge' FROM companies WHERE slug = 'capital-city-garage-doors';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'ccm-garage-door-dewitt',
  'CCM Garage Door',
  5.0, 20, 'DeWitt, MI', 'dewitt',
  '["Repair", "Installation"]',
  0, 0,
  'CCM Garage Door provides garage door installation and service/repair in DeWitt, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '517-974-8047', NULL,
  NULL, NULL,
  'https://www.google.com/maps/search/?api=1&query=CCM+Garage+Door+DeWitt+Michigan', 'Current Business Index', 'High', 'Lansing / Mid-Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'ccm-garage-door-dewitt';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'ccm-garage-door-dewitt';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'ccm-garage-door-dewitt';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'ccm-garage-door-dewitt';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'ccm-garage-door-dewitt';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'DeWitt' FROM companies WHERE slug = 'ccm-garage-door-dewitt';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Lansing' FROM companies WHERE slug = 'ccm-garage-door-dewitt';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'East Lansing' FROM companies WHERE slug = 'ccm-garage-door-dewitt';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Jackson' FROM companies WHERE slug = 'ccm-garage-door-dewitt';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'chad-hopkins-custom-doors-fenton',
  'Chad Hopkins Custom Doors',
  4.9, 43, 'Fenton, MI', 'fenton',
  '["Repair", "Installation"]',
  0, 0,
  'Chad Hopkins Custom Doors provides garage door installation and service/repair in Fenton, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '810-309-5631', NULL,
  '1017 N Leroy St, Fenton, MI 48430', NULL,
  'https://www.google.com/maps/search/?api=1&query=Chad+Hopkins+Custom+Doors+1017+N+Leroy+St%2C+Fenton%2C+MI+48430+Michigan', 'Current Business Index', 'High', 'Flint / Genesee / Lapeer', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'chad-hopkins-custom-doors-fenton';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'chad-hopkins-custom-doors-fenton';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'chad-hopkins-custom-doors-fenton';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'chad-hopkins-custom-doors-fenton';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'chad-hopkins-custom-doors-fenton';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Fenton' FROM companies WHERE slug = 'chad-hopkins-custom-doors-fenton';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Flint' FROM companies WHERE slug = 'chad-hopkins-custom-doors-fenton';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Grand Blanc' FROM companies WHERE slug = 'chad-hopkins-custom-doors-fenton';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'city-wide-door-co-ira',
  'City Wide Door Co',
  0.0, 0, 'Ira, MI', 'ira',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'City Wide Door Co provides garage door installation and service/repair in Ira, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '586-716-9990', NULL,
  '9451 MARINE CITY HIGHWAY, IRA, MI 48023-1224', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-1-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'city-wide-door-co-ira';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'city-wide-door-co-ira';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'city-wide-door-co-ira';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'city-wide-door-co-ira';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'city-wide-door-co-ira';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Ira' FROM companies WHERE slug = 'city-wide-door-co-ira';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'compaan-door-operator',
  'Compaan Door & Operator Co',
  4.9, 1830, 'Traverse City, MI', 'traverse-city',
  '["Repair", "Installation", "Openers", "Commercial"]',
  0, 0,
  'Compaan Door & Operator Co has installed and repaired residential and commercial garage doors across Michigan since 1955. Their Traverse City location at 1606 Barlow St serves Grand Traverse, Leelanau, Benzie, and Antrim counties with IDA-certified technicians and same-day service on morning calls.',
  'Mon–Fri, 7am–5pm', NULL, '231-943-1111', NULL,
  '1606 Barlow St, Ste 2, Traverse City, MI 49686', 'https://compaandoor.com/locations/traverse-city/',
  'https://www.google.com/maps/search/?api=1&query=Compaan+Garage+Doors+1606+Barlow+St%2C+Ste+2%2C+Traverse+City%2C+MI+49686+Michigan', 'Current Business Index', 'Medium', 'Traverse City / Northern Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'compaan-door-operator';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'compaan-door-operator';
INSERT INTO company_services (company_id, service) SELECT id, 'Commercial Service' FROM companies WHERE slug = 'compaan-door-operator';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'compaan-door-operator';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'compaan-door-operator';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'compaan-door-operator';
INSERT INTO company_services (company_id, service) SELECT id, 'Emergency Service' FROM companies WHERE slug = 'compaan-door-operator';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Traverse City' FROM companies WHERE slug = 'compaan-door-operator';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Acme' FROM companies WHERE slug = 'compaan-door-operator';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Elk Rapids' FROM companies WHERE slug = 'compaan-door-operator';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Interlochen' FROM companies WHERE slug = 'compaan-door-operator';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Cadillac' FROM companies WHERE slug = 'compaan-door-operator';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Petoskey' FROM companies WHERE slug = 'compaan-door-operator';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'compaan-garage-doors',
  'Compaan Garage Doors',
  4.8, 130, 'Grand Rapids, MI', 'grand-rapids',
  '["Repair", "Installation", "Commercial"]',
  0, 0,
  'Compaan Garage Doors serves West Michigan homeowners and light commercial customers with repair, installation, and opener work.',
  'Mon–Fri, 7am–5pm', NULL, '616-271-6200', NULL,
  '87 54th St SW #8, Grand Rapids, MI 49548', NULL,
  'https://www.google.com/maps/search/?api=1&query=Compaan+Door+%26+Operator+Co.+87+54th+St+SW+%238%2C+Grand+Rapids%2C+MI+49548+Michigan', 'Current Business Index', 'High', 'Grand Rapids / West Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'compaan-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'compaan-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Commercial Service' FROM companies WHERE slug = 'compaan-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'compaan-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'compaan-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Grand Rapids' FROM companies WHERE slug = 'compaan-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Wyoming' FROM companies WHERE slug = 'compaan-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Holland' FROM companies WHERE slug = 'compaan-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Zeeland' FROM companies WHERE slug = 'compaan-garage-doors';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'complete-garage-doors',
  'Complete Garage Doors LLC',
  5.0, 155, 'Byron Center, MI', 'byron-center',
  '["Repair", "Installation", "Openers"]',
  0, 0,
  'Complete Garage Doors LLC serves Byron Center and southwest Grand Rapids suburbs with residential repair, new doors, and opener installs.',
  'Mon–Fri, 8am–5pm', NULL, '616-916-4362', NULL,
  '550 76th St SW, Byron Center, MI 49315', NULL,
  'https://www.google.com/maps/search/?api=1&query=Complete+Garage+Doors+LLC+550+76th+St+SW%2C+Byron+Center%2C+MI+49315+Michigan', 'Current Business Index', 'High', 'Grand Rapids / West Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'complete-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'complete-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'complete-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'complete-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'complete-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Byron Center' FROM companies WHERE slug = 'complete-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Wyoming' FROM companies WHERE slug = 'complete-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Grand Rapids' FROM companies WHERE slug = 'complete-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Kentwood' FROM companies WHERE slug = 'complete-garage-doors';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'crawford-door-company-of-st-clair-county-kimball',
  'Crawford Door Company of St Clair County',
  0.0, 0, 'Kimball, MI', 'kimball',
  '["Repair", "Installation"]',
  0, 0,
  'Crawford Door Company of St Clair County provides garage door installation and service/repair in Kimball, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '810-987-5585', NULL,
  '5400 Lapeer Rd, Kimball, MI 48074', NULL,
  'https://www.google.com/maps/search/?api=1&query=Crawford+Door+Company+Of+St+Clair+County+5400+Lapeer+Rd%2C+Kimball%2C+MI+48074+Michigan', 'Current Business Index', 'Medium', 'Port Huron / St. Clair-Macomb', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'crawford-door-company-of-st-clair-county-kimball';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'crawford-door-company-of-st-clair-county-kimball';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'crawford-door-company-of-st-clair-county-kimball';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'crawford-door-company-of-st-clair-county-kimball';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'crawford-door-company-of-st-clair-county-kimball';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Kimball' FROM companies WHERE slug = 'crawford-door-company-of-st-clair-county-kimball';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Port Huron' FROM companies WHERE slug = 'crawford-door-company-of-st-clair-county-kimball';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Clinton Township' FROM companies WHERE slug = 'crawford-door-company-of-st-clair-county-kimball';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Shelby Township' FROM companies WHERE slug = 'crawford-door-company-of-st-clair-county-kimball';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'd-d-doors-flint',
  'D & D Doors',
  4.5, 11, 'Flint, MI', 'flint',
  '["Repair", "Installation"]',
  0, 0,
  'D & D Doors provides garage door installation and service/repair in Flint, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '810-845-9540', NULL,
  '1550 Mabel Ave, Flint, MI 48506', NULL,
  'https://www.google.com/maps/search/?api=1&query=D+%26+D+Doors+1550+Mabel+Ave%2C+Flint%2C+MI+48506+Michigan', 'Current Business Index', 'High', 'Flint / Genesee / Lapeer', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'd-d-doors-flint';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'd-d-doors-flint';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'd-d-doors-flint';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'd-d-doors-flint';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'd-d-doors-flint';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Flint' FROM companies WHERE slug = 'd-d-doors-flint';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Grand Blanc' FROM companies WHERE slug = 'd-d-doors-flint';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Fenton' FROM companies WHERE slug = 'd-d-doors-flint';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'd-d-garage-door-llc-otsego',
  'D & D Garage Door LLC',
  5.0, 4, 'Otsego, MI', 'otsego',
  '["Repair", "Installation"]',
  0, 0,
  'D & D Garage Door LLC provides garage door installation and service/repair in Otsego, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '269-650-2603', NULL,
  '557 Lincoln Rd, Otsego, MI 49078', NULL,
  'https://www.google.com/maps/search/?api=1&query=D+%26+D+Garage+Door+LLC+557+Lincoln+Rd%2C+Otsego%2C+MI+49078+Michigan', 'Current Business Index', 'Medium', 'Kalamazoo / Southwest Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'd-d-garage-door-llc-otsego';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'd-d-garage-door-llc-otsego';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'd-d-garage-door-llc-otsego';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'd-d-garage-door-llc-otsego';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'd-d-garage-door-llc-otsego';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Otsego' FROM companies WHERE slug = 'd-d-garage-door-llc-otsego';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Kalamazoo' FROM companies WHERE slug = 'd-d-garage-door-llc-otsego';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Portage' FROM companies WHERE slug = 'd-d-garage-door-llc-otsego';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Battle Creek' FROM companies WHERE slug = 'd-d-garage-door-llc-otsego';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'd-l-garage-door-auburn',
  'D&L Garage Door',
  5.0, 1, 'Auburn, MI', 'auburn',
  '["Repair", "Installation"]',
  0, 0,
  'D&L Garage Door provides garage door installation and service/repair in Auburn, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '989-239-2586', NULL,
  '5251 9th Mile Rd, Auburn, MI 48611', NULL,
  'https://www.google.com/maps/search/?api=1&query=D%26L+Garage+Door+5251+9th+Mile+Rd%2C+Auburn%2C+MI+48611+Michigan', 'Current Business Index', 'Medium', 'Saginaw / Great Lakes Bay', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'd-l-garage-door-auburn';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'd-l-garage-door-auburn';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'd-l-garage-door-auburn';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'd-l-garage-door-auburn';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'd-l-garage-door-auburn';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Auburn' FROM companies WHERE slug = 'd-l-garage-door-auburn';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Saginaw' FROM companies WHERE slug = 'd-l-garage-door-auburn';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Bay City' FROM companies WHERE slug = 'd-l-garage-door-auburn';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Midland' FROM companies WHERE slug = 'd-l-garage-door-auburn';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'd-l-door-installation-hudsonville',
  'D.L Door Installation',
  5.0, 89, 'Hudsonville, MI', 'hudsonville',
  '["Repair", "Installation"]',
  0, 0,
  'D.L Door Installation provides garage door installation and service/repair in Hudsonville, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '616-312-3309', NULL,
  '3245 Van Buren St, Hudsonville, MI 49426', NULL,
  'https://www.google.com/maps/search/?api=1&query=D.L+Door+Installation+3245+Van+Buren+St%2C+Hudsonville%2C+MI+49426+Michigan', 'Current Business Index', 'High', 'Grand Rapids / West Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'd-l-door-installation-hudsonville';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'd-l-door-installation-hudsonville';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'd-l-door-installation-hudsonville';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'd-l-door-installation-hudsonville';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'd-l-door-installation-hudsonville';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Hudsonville' FROM companies WHERE slug = 'd-l-door-installation-hudsonville';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Grand Rapids' FROM companies WHERE slug = 'd-l-door-installation-hudsonville';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Wyoming' FROM companies WHERE slug = 'd-l-door-installation-hudsonville';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Holland' FROM companies WHERE slug = 'd-l-door-installation-hudsonville';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'davison-overhead-door-co-davison',
  'Davison Overhead Door Co',
  5.0, 6, 'Davison, MI', 'davison',
  '["Repair", "Installation"]',
  0, 0,
  'Davison Overhead Door Co provides garage door installation and service/repair in Davison, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '810-653-3697', NULL,
  '5112 N State Rd, Davison, MI 48423', NULL,
  'https://www.google.com/maps/search/?api=1&query=Davison+Overhead+Door+Co+5112+N+State+Rd%2C+Davison%2C+MI+48423+Michigan', 'Current Business Index', 'Medium', 'Flint / Genesee / Lapeer', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'davison-overhead-door-co-davison';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'davison-overhead-door-co-davison';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'davison-overhead-door-co-davison';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'davison-overhead-door-co-davison';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'davison-overhead-door-co-davison';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Davison' FROM companies WHERE slug = 'davison-overhead-door-co-davison';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Flint' FROM companies WHERE slug = 'davison-overhead-door-co-davison';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Grand Blanc' FROM companies WHERE slug = 'davison-overhead-door-co-davison';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Fenton' FROM companies WHERE slug = 'davison-overhead-door-co-davison';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'deboer-garage-doors',
  'DeBoer Garage Doors LLC',
  5.0, 106, 'Grand Rapids, MI', 'grand-rapids',
  '["Repair", "Installation", "Maintenance"]',
  0, 0,
  'DeBoer Garage Doors LLC is a Grand Rapids residential garage door contractor offering repair, installation, and seasonal maintenance.',
  'Mon–Fri, 7am–5pm', NULL, '616-432-3116', NULL,
  '1041 Woodrow Ave NW, Grand Rapids, MI 49504', NULL,
  'https://www.google.com/maps/search/?api=1&query=DeBoer+Garage+Doors+LLC+1041+Woodrow+Ave+NW%2C+Grand+Rapids%2C+MI+49504+Michigan', 'Current Business Index', 'High', 'Grand Rapids / West Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'deboer-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'deboer-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'deboer-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'deboer-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'deboer-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Grand Rapids' FROM companies WHERE slug = 'deboer-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Wyoming' FROM companies WHERE slug = 'deboer-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Kentwood' FROM companies WHERE slug = 'deboer-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Walker' FROM companies WHERE slug = 'deboer-garage-doors';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'delta-door-bark-river',
  'Delta Door',
  0.0, 0, 'Bark River, MI', 'bark-river',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'Delta Door provides garage door installation and service/repair in Bark River, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '906-241-5357', NULL,
  '4341 K Rd, Bark River, MI 49807-9619', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-1-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'delta-door-bark-river';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'delta-door-bark-river';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'delta-door-bark-river';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'delta-door-bark-river';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'delta-door-bark-river';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Bark River' FROM companies WHERE slug = 'delta-door-bark-river';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'delta-door-dock-escanaba',
  'Delta Door & Dock',
  5.0, 43, 'Escanaba, MI', 'escanaba',
  '["Repair", "Installation"]',
  0, 0,
  'Delta Door & Dock provides garage door installation and service/repair in Escanaba, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '906-428-8488', NULL,
  '2120 N Lincoln Rd, Escanaba, MI 49829', NULL,
  'https://www.google.com/maps/search/?api=1&query=Delta+Door+%26+Dock+2120+N+Lincoln+Rd%2C+Escanaba%2C+MI+49829+Michigan', 'Current Business Index', 'High', 'Upper Peninsula', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'delta-door-dock-escanaba';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'delta-door-dock-escanaba';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'delta-door-dock-escanaba';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'delta-door-dock-escanaba';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'delta-door-dock-escanaba';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Escanaba' FROM companies WHERE slug = 'delta-door-dock-escanaba';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Marquette' FROM companies WHERE slug = 'delta-door-dock-escanaba';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'delta-door-co-gladstone',
  'Delta Door Co',
  4.8, 19, 'Gladstone, MI', 'gladstone',
  '["Repair", "Installation"]',
  0, 0,
  'Delta Door Co provides garage door installation and service/repair in Gladstone, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '906-428-1294', NULL,
  '8373 P 5, Gladstone, MI 49837', NULL,
  'https://www.google.com/maps/search/?api=1&query=Delta+Door+Co+8373+P+5%2C+Gladstone%2C+MI+49837+Michigan', 'Current Business Index', 'High', 'Upper Peninsula', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'delta-door-co-gladstone';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'delta-door-co-gladstone';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'delta-door-co-gladstone';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'delta-door-co-gladstone';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'delta-door-co-gladstone';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Gladstone' FROM companies WHERE slug = 'delta-door-co-gladstone';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Marquette' FROM companies WHERE slug = 'delta-door-co-gladstone';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'derek-s-garage-door-sales-service-llc-battle',
  'Derek''s Garage Door Sales & Service LLC',
  0.0, 0, 'Battle Creek, MI', 'battle-creek',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'Derek''s Garage Door Sales & Service LLC provides garage door installation and service/repair in Battle Creek, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '269-419-9476', NULL,
  '13770 STONE JUG RD, BATTLE CREEK, MI 49015-8622', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-1-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'derek-s-garage-door-sales-service-llc-battle';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'derek-s-garage-door-sales-service-llc-battle';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'derek-s-garage-door-sales-service-llc-battle';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'derek-s-garage-door-sales-service-llc-battle';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'derek-s-garage-door-sales-service-llc-battle';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Battle Creek' FROM companies WHERE slug = 'derek-s-garage-door-sales-service-llc-battle';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'dexter-garage-door',
  'Dexter Garage Door',
  4.9, 64, 'Ann Arbor, MI', 'ann-arbor',
  '["Repair", "Springs", "Installation"]',
  0, 0,
  'Dexter Garage Door serves western Washtenaw County and the Ann Arbor area with residential spring repair, door replacement, and opener installs.',
  'Mon–Fri, 8am–5pm', NULL, NULL, NULL,
  NULL, NULL,
  NULL, NULL, NULL, NULL, NULL,
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'dexter-garage-door';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'dexter-garage-door';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'dexter-garage-door';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'dexter-garage-door';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'dexter-garage-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Dexter' FROM companies WHERE slug = 'dexter-garage-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Ann Arbor' FROM companies WHERE slug = 'dexter-garage-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Chelsea' FROM companies WHERE slug = 'dexter-garage-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Brighton' FROM companies WHERE slug = 'dexter-garage-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Howell' FROM companies WHERE slug = 'dexter-garage-door';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'dexter-garage-door-dexter',
  'Dexter Garage Door',
  4.1, 19, 'Dexter, MI', 'dexter',
  '["Repair", "Installation"]',
  0, 0,
  'Dexter Garage Door provides garage door installation and service/repair in Dexter, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '734-417-6182', NULL,
  '8340 Huron River Dr, Dexter, MI 48130', NULL,
  'https://www.google.com/maps/search/?api=1&query=Dexter+Garage+Door+8340+Huron+River+Dr%2C+Dexter%2C+MI+48130+Michigan', 'Current Business Index', 'High', 'Jackson / South-Central Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'dexter-garage-door-dexter';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'dexter-garage-door-dexter';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'dexter-garage-door-dexter';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'dexter-garage-door-dexter';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'dexter-garage-door-dexter';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Dexter' FROM companies WHERE slug = 'dexter-garage-door-dexter';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Jackson' FROM companies WHERE slug = 'dexter-garage-door-dexter';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Battle Creek' FROM companies WHERE slug = 'dexter-garage-door-dexter';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Ann Arbor' FROM companies WHERE slug = 'dexter-garage-door-dexter';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'discount-door-co',
  'Discount Door CO LLC',
  5.0, 281, 'Comstock Park, MI', 'comstock-park',
  '["Repair", "Installation", "Maintenance", "Clopay Dealer"]',
  0, 0,
  'Discount Door CO LLC is a Comstock Park–based garage door company serving Grand Rapids and northern Kent County with repair, installation, and maintenance.',
  'Mon–Fri, 8am–5pm', NULL, '616-363-5692', NULL,
  '4780 West River Road, Comstock Park, MI 49321-8927', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-1-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'discount-door-co';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'discount-door-co';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'discount-door-co';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'discount-door-co';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'discount-door-co';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Comstock Park' FROM companies WHERE slug = 'discount-door-co';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Grand Rapids' FROM companies WHERE slug = 'discount-door-co';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Walker' FROM companies WHERE slug = 'discount-door-co';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Rockford' FROM companies WHERE slug = 'discount-door-co';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'discount-door-services-homer',
  'Discount Door Services',
  4.8, 27, 'Homer, MI', 'homer',
  '["Repair", "Installation"]',
  0, 0,
  'Discount Door Services provides garage door installation and service/repair in Homer, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '517-812-5665', NULL,
  '25560 M-60, Homer, MI 49245', NULL,
  'https://www.google.com/maps/search/?api=1&query=Discount+Door+Services+25560+M-60%2C+Homer%2C+MI+49245+Michigan', 'Current Business Index', 'High', 'Jackson / South-Central Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'discount-door-services-homer';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'discount-door-services-homer';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'discount-door-services-homer';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'discount-door-services-homer';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'discount-door-services-homer';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Homer' FROM companies WHERE slug = 'discount-door-services-homer';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Jackson' FROM companies WHERE slug = 'discount-door-services-homer';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Battle Creek' FROM companies WHERE slug = 'discount-door-services-homer';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Ann Arbor' FROM companies WHERE slug = 'discount-door-services-homer';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'door-pro-ii-llc-marquette',
  'Door Pro II, LLC',
  0.0, 0, 'Marquette, MI', 'marquette',
  '["Repair", "Installation"]',
  0, 0,
  'Door Pro II, LLC provides garage door installation and service/repair in Marquette, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '906-360-2998', NULL,
  NULL, NULL,
  'https://www.google.com/maps/search/?api=1&query=Door+Pro+II%2C+LLC+Marquette+Michigan', 'Current Business Index', 'Medium', 'Upper Peninsula', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'door-pro-ii-llc-marquette';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'door-pro-ii-llc-marquette';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'door-pro-ii-llc-marquette';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'door-pro-ii-llc-marquette';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'door-pro-ii-llc-marquette';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Marquette' FROM companies WHERE slug = 'door-pro-ii-llc-marquette';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'door-service-llc-lansing',
  'Door Service LLC',
  4.9, 90, 'Lansing, MI', 'lansing',
  '["Repair", "Installation"]',
  0, 0,
  'Door Service LLC provides garage door installation and service/repair in Lansing, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '517-507-8781', NULL,
  NULL, NULL,
  'https://www.google.com/maps/search/?api=1&query=Door+Service+LLC+Lansing+Michigan', 'Current Business Index', 'High', 'Lansing / Mid-Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'door-service-llc-lansing';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'door-service-llc-lansing';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'door-service-llc-lansing';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'door-service-llc-lansing';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'door-service-llc-lansing';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Lansing' FROM companies WHERE slug = 'door-service-llc-lansing';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'East Lansing' FROM companies WHERE slug = 'door-service-llc-lansing';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Jackson' FROM companies WHERE slug = 'door-service-llc-lansing';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'door-teq-garage-door-service-battle-creek',
  'DOOR TEQ garage door service',
  5.0, 60, 'Battle Creek, MI', 'battle-creek',
  '["Repair", "Installation"]',
  0, 0,
  'DOOR TEQ garage door service provides garage door installation and service/repair in Battle Creek, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '269-420-1067', NULL,
  '2815 W Kirby Rd, Battle Creek, MI 49017', NULL,
  'https://www.google.com/maps/search/?api=1&query=DOOR+TEQ+garage+door+service+2815+W+Kirby+Rd%2C+Battle+Creek%2C+MI+49017+Michigan', 'Current Business Index', 'High', 'Kalamazoo / Southwest Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'door-teq-garage-door-service-battle-creek';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'door-teq-garage-door-service-battle-creek';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'door-teq-garage-door-service-battle-creek';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'door-teq-garage-door-service-battle-creek';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'door-teq-garage-door-service-battle-creek';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Battle Creek' FROM companies WHERE slug = 'door-teq-garage-door-service-battle-creek';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Kalamazoo' FROM companies WHERE slug = 'door-teq-garage-door-service-battle-creek';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Portage' FROM companies WHERE slug = 'door-teq-garage-door-service-battle-creek';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'dover-doors',
  'Dover Doors',
  4.7, 95, 'Farmington Hills, MI', 'farmington-hills',
  '["Repair", "Installation", "Commercial"]',
  0, 0,
  'Dover Doors serves Farmington Hills and Metro Detroit with residential and commercial garage door sales, service, and installation.',
  'Mon–Fri, 7am–5pm', NULL, NULL, NULL,
  NULL, NULL,
  NULL, NULL, NULL, NULL, NULL,
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'dover-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'dover-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Commercial Service' FROM companies WHERE slug = 'dover-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'dover-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'dover-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'dover-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Farmington Hills' FROM companies WHERE slug = 'dover-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Novi' FROM companies WHERE slug = 'dover-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Livonia' FROM companies WHERE slug = 'dover-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Southfield' FROM companies WHERE slug = 'dover-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'West Bloomfield' FROM companies WHERE slug = 'dover-doors';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'dover-doors-windows-saginaw',
  'Dover Doors & Windows',
  4.9, 468, 'Saginaw, MI', 'saginaw',
  '["Repair", "Installation"]',
  0, 0,
  'Dover Doors & Windows provides garage door installation and service/repair in Saginaw, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '989-355-1519', NULL,
  '2857 Enterprise Ct, Saginaw, MI 48603', NULL,
  'https://www.google.com/maps/search/?api=1&query=Dover+Doors+%26+Windows+2857+Enterprise+Ct%2C+Saginaw%2C+MI+48603+Michigan', 'Current Business Index', 'High', 'Saginaw / Great Lakes Bay', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'dover-doors-windows-saginaw';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'dover-doors-windows-saginaw';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'dover-doors-windows-saginaw';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'dover-doors-windows-saginaw';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'dover-doors-windows-saginaw';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Saginaw' FROM companies WHERE slug = 'dover-doors-windows-saginaw';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Bay City' FROM companies WHERE slug = 'dover-doors-windows-saginaw';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Midland' FROM companies WHERE slug = 'dover-doors-windows-saginaw';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'dover-doors-windows-lansing-lansing',
  'Dover Doors & Windows (Lansing)',
  4.9, 55, 'Lansing, MI', 'lansing',
  '["Repair", "Installation"]',
  0, 0,
  'Dover Doors & Windows (Lansing) provides garage door installation and service/repair in Lansing, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '517-329-5090', NULL,
  '3110 Turner Rd Unit E, Lansing, MI 48906', NULL,
  'https://www.google.com/maps/search/?api=1&query=Dover+Doors+%26+Windows+%28Lansing%29+3110+Turner+Rd+Unit+E%2C+Lansing%2C+MI+48906+Michigan', 'Current Business Index', 'High', 'Lansing / Mid-Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'dover-doors-windows-lansing-lansing';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'dover-doors-windows-lansing-lansing';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'dover-doors-windows-lansing-lansing';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'dover-doors-windows-lansing-lansing';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'dover-doors-windows-lansing-lansing';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Lansing' FROM companies WHERE slug = 'dover-doors-windows-lansing-lansing';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'East Lansing' FROM companies WHERE slug = 'dover-doors-windows-lansing-lansing';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Jackson' FROM companies WHERE slug = 'dover-doors-windows-lansing-lansing';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'dynamic-garage-doors',
  'Dynamic Garage Doors, LLC',
  5.0, 56, 'Grand Rapids, MI', 'grand-rapids',
  '["Repair", "Openers", "Installation"]',
  0, 0,
  'Dynamic Garage Doors, LLC provides residential garage door repair, opener service, and installation throughout Greater Grand Rapids.',
  'Mon–Fri, 8am–6pm', NULL, NULL, NULL,
  NULL, NULL,
  NULL, NULL, NULL, NULL, NULL,
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'dynamic-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'dynamic-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'dynamic-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'dynamic-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'dynamic-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Grand Rapids' FROM companies WHERE slug = 'dynamic-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Wyoming' FROM companies WHERE slug = 'dynamic-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Holland' FROM companies WHERE slug = 'dynamic-garage-doors';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'elevation-garage-door-co-wyoming',
  'Elevation Garage Door Co',
  4.9, 66, 'Wyoming, MI', 'wyoming',
  '["Repair", "Installation"]',
  0, 0,
  'Elevation Garage Door Co provides garage door installation and service/repair in Wyoming, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '616-259-6233', NULL,
  NULL, NULL,
  'https://www.google.com/maps/search/?api=1&query=Elevation+Garage+Door+Co+Wyoming+Michigan', 'Current Business Index', 'High', 'Grand Rapids / West Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'elevation-garage-door-co-wyoming';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'elevation-garage-door-co-wyoming';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'elevation-garage-door-co-wyoming';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'elevation-garage-door-co-wyoming';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'elevation-garage-door-co-wyoming';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Wyoming' FROM companies WHERE slug = 'elevation-garage-door-co-wyoming';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Grand Rapids' FROM companies WHERE slug = 'elevation-garage-door-co-wyoming';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Holland' FROM companies WHERE slug = 'elevation-garage-door-co-wyoming';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'elite-garage-door-repair-of-detroit',
  'Elite Garage Door Repair of Detroit',
  4.7, 25, 'Detroit, MI', 'detroit',
  '["Repair", "Openers", "Emergency"]',
  0, 1,
  'Elite Garage Door Repair of Detroit provides residential garage door and opener repair with free estimates across Metro Detroit.',
  'Mon–Sat, 8am–6pm', 'Emergency services offered', '313-335-3509', NULL,
  NULL, NULL,
  'https://www.google.com/maps/search/?api=1&query=Elite+Garage+Door+Repair+Of+Detroit+Detroit+Michigan', 'Current Business Index', 'High', 'Detroit / Southeast Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'elite-garage-door-repair-of-detroit';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'elite-garage-door-repair-of-detroit';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'elite-garage-door-repair-of-detroit';
INSERT INTO company_services (company_id, service) SELECT id, 'Emergency Service' FROM companies WHERE slug = 'elite-garage-door-repair-of-detroit';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Detroit' FROM companies WHERE slug = 'elite-garage-door-repair-of-detroit';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Warren' FROM companies WHERE slug = 'elite-garage-door-repair-of-detroit';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Dearborn' FROM companies WHERE slug = 'elite-garage-door-repair-of-detroit';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Royal Oak' FROM companies WHERE slug = 'elite-garage-door-repair-of-detroit';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'elite-garage-door-repair-of-southfield-southfield',
  'Elite Garage Door Repair of Southfield',
  4.9, 206, 'Southfield, MI', 'southfield',
  '["Repair", "Installation"]',
  0, 0,
  'Elite Garage Door Repair of Southfield provides garage door installation and service/repair in Southfield, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '248-469-8728', NULL,
  NULL, NULL,
  'https://www.google.com/maps/search/?api=1&query=Elite+Garage+Door+Repair+of+Southfield+Southfield+Michigan', 'Current Business Index', 'High', 'Detroit / Southeast Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'elite-garage-door-repair-of-southfield-southfield';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'elite-garage-door-repair-of-southfield-southfield';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'elite-garage-door-repair-of-southfield-southfield';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'elite-garage-door-repair-of-southfield-southfield';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'elite-garage-door-repair-of-southfield-southfield';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Southfield' FROM companies WHERE slug = 'elite-garage-door-repair-of-southfield-southfield';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Detroit' FROM companies WHERE slug = 'elite-garage-door-repair-of-southfield-southfield';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Warren' FROM companies WHERE slug = 'elite-garage-door-repair-of-southfield-southfield';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Dearborn' FROM companies WHERE slug = 'elite-garage-door-repair-of-southfield-southfield';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Livonia' FROM companies WHERE slug = 'elite-garage-door-repair-of-southfield-southfield';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'empire-garage-door-repair-llc-brighton',
  'Empire Garage Door & Repair LLC',
  5.0, 533, 'Brighton, MI', 'brighton',
  '["Repair", "Installation"]',
  0, 0,
  'Empire Garage Door & Repair LLC provides garage door installation and service/repair in Brighton, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '248-667-2325', NULL,
  '3152 Sandpoint Dr, Brighton, MI 48114', NULL,
  'https://www.google.com/maps/search/?api=1&query=Empire+Garage+Door+%26+Repair+LLC+3152+Sandpoint+Dr%2C+Brighton%2C+MI+48114+Michigan', 'Current Business Index', 'High', 'Ann Arbor / Livingston', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'empire-garage-door-repair-llc-brighton';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'empire-garage-door-repair-llc-brighton';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'empire-garage-door-repair-llc-brighton';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'empire-garage-door-repair-llc-brighton';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'empire-garage-door-repair-llc-brighton';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Brighton' FROM companies WHERE slug = 'empire-garage-door-repair-llc-brighton';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Ann Arbor' FROM companies WHERE slug = 'empire-garage-door-repair-llc-brighton';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Ypsilanti' FROM companies WHERE slug = 'empire-garage-door-repair-llc-brighton';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Howell' FROM companies WHERE slug = 'empire-garage-door-repair-llc-brighton';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'empire-garage-doors',
  'Empire Garage Doors',
  5.0, 11, 'Grand Rapids, MI', 'grand-rapids',
  '["Repair", "Installation"]',
  0, 0,
  'Empire Garage Doors serves Grand Rapids homeowners with residential garage door repair and replacement.',
  'Mon–Fri, 8am–6pm', NULL, NULL, NULL,
  NULL, NULL,
  NULL, NULL, NULL, NULL, NULL,
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'empire-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'empire-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'empire-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'empire-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'empire-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Grand Rapids' FROM companies WHERE slug = 'empire-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Wyoming' FROM companies WHERE slug = 'empire-garage-doors';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'environmental-door',
  'Environmental Door',
  5.0, 722, 'Grand Rapids, MI', 'grand-rapids',
  '["Repair", "Installation", "Openers"]',
  0, 0,
  'Environmental Door is a high-volume Grand Rapids garage door company known for residential repair, installation, and opener service across West Michigan.',
  'Mon–Fri, 7am–6pm', NULL, '616-453-0164', NULL,
  '11501 3rd Ave NW, Grand Rapids, MI 49534', NULL,
  'https://www.google.com/maps/search/?api=1&query=Environmental+Door+11501+3rd+Ave+NW%2C+Grand+Rapids%2C+MI+49534+Michigan', 'Current Business Index', 'High', 'Grand Rapids / West Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'environmental-door';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'environmental-door';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'environmental-door';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'environmental-door';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'environmental-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Grand Rapids' FROM companies WHERE slug = 'environmental-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Wyoming' FROM companies WHERE slug = 'environmental-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Kentwood' FROM companies WHERE slug = 'environmental-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Walker' FROM companies WHERE slug = 'environmental-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Holland' FROM companies WHERE slug = 'environmental-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Muskegon' FROM companies WHERE slug = 'environmental-door';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'expert-garage-door-repair-llc-brighton',
  'Expert Garage Door Repair LLC',
  4.9, 279, 'Brighton, MI', 'brighton',
  '["Repair", "Installation"]',
  0, 0,
  'Expert Garage Door Repair LLC provides garage door installation and service/repair in Brighton, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '248-826-5998', NULL,
  NULL, NULL,
  'https://www.google.com/maps/search/?api=1&query=Expert+Garage+Door+Repair+LLC+Brighton+Michigan', 'Current Business Index', 'High', 'Detroit / Southeast Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'expert-garage-door-repair-llc-brighton';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'expert-garage-door-repair-llc-brighton';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'expert-garage-door-repair-llc-brighton';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'expert-garage-door-repair-llc-brighton';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'expert-garage-door-repair-llc-brighton';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Brighton' FROM companies WHERE slug = 'expert-garage-door-repair-llc-brighton';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Detroit' FROM companies WHERE slug = 'expert-garage-door-repair-llc-brighton';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Warren' FROM companies WHERE slug = 'expert-garage-door-repair-llc-brighton';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Dearborn' FROM companies WHERE slug = 'expert-garage-door-repair-llc-brighton';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Livonia' FROM companies WHERE slug = 'expert-garage-door-repair-llc-brighton';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'express-garage-door-repair',
  'Express Garage Door Repair',
  5.0, 219, 'Grand Rapids, MI', 'grand-rapids',
  '["Repair", "Springs", "Emergency"]',
  0, 1,
  'Express Garage Door Repair focuses on fast residential repair and spring replacement for homeowners across the Grand Rapids metro.',
  'Mon–Sat, 7am–7pm', 'Same-day / after-hours', '616-282-2324', NULL,
  '28 Lafayette Ave NE Unit 5, Grand Rapids, MI 49503', NULL,
  'https://www.google.com/maps/search/?api=1&query=Express+Garage+Door+Repair+28+Lafayette+Ave+NE+Unit+5%2C+Grand+Rapids%2C+MI+49503+Michigan', 'Current Business Index', 'High', 'Grand Rapids / West Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'express-garage-door-repair';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'express-garage-door-repair';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'express-garage-door-repair';
INSERT INTO company_services (company_id, service) SELECT id, 'Emergency Service' FROM companies WHERE slug = 'express-garage-door-repair';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Grand Rapids' FROM companies WHERE slug = 'express-garage-door-repair';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Wyoming' FROM companies WHERE slug = 'express-garage-door-repair';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Kentwood' FROM companies WHERE slug = 'express-garage-door-repair';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Walker' FROM companies WHERE slug = 'express-garage-door-repair';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'ezhawk-garage-door',
  'EZhawk Garage Door',
  4.9, 54, 'Detroit, MI', 'detroit',
  '["Repair", "Openers", "Emergency"]',
  0, 1,
  'EZhawk Garage Door has served Detroit-area homeowners since 2014 with repair, opener installs, and emergency response.',
  'Mon–Sat, 7am–7pm', 'Emergency services offered', NULL, NULL,
  NULL, NULL,
  NULL, NULL, NULL, NULL, NULL,
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'ezhawk-garage-door';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'ezhawk-garage-door';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'ezhawk-garage-door';
INSERT INTO company_services (company_id, service) SELECT id, 'Emergency Service' FROM companies WHERE slug = 'ezhawk-garage-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Detroit' FROM companies WHERE slug = 'ezhawk-garage-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Dearborn' FROM companies WHERE slug = 'ezhawk-garage-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Warren' FROM companies WHERE slug = 'ezhawk-garage-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Livonia' FROM companies WHERE slug = 'ezhawk-garage-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Southfield' FROM companies WHERE slug = 'ezhawk-garage-door';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'fawley-overhead-door',
  'Fawley Overhead Door',
  4.7, 84, 'Kalamazoo, MI', 'kalamazoo',
  '["Repair", "Installation", "Openers"]',
  0, 0,
  'Fawley Overhead Door serves Kalamazoo and Southwest Michigan with residential garage door repair, installation, and opener service.',
  'Mon–Fri, 8am–5pm', NULL, NULL, NULL,
  NULL, NULL,
  NULL, NULL, NULL, NULL, NULL,
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'fawley-overhead-door';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'fawley-overhead-door';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'fawley-overhead-door';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'fawley-overhead-door';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'fawley-overhead-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Kalamazoo' FROM companies WHERE slug = 'fawley-overhead-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Portage' FROM companies WHERE slug = 'fawley-overhead-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Battle Creek' FROM companies WHERE slug = 'fawley-overhead-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Vicksburg' FROM companies WHERE slug = 'fawley-overhead-door';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'fawley-overhead-door-portage',
  'Fawley Overhead Door',
  0.0, 0, 'Portage, MI', 'portage',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'Fawley Overhead Door provides garage door installation and service/repair in Portage, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '269-327-2034', NULL,
  '6736 Lovers Lane, Portage, MI 49002-3606', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-1-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'fawley-overhead-door-portage';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'fawley-overhead-door-portage';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'fawley-overhead-door-portage';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'fawley-overhead-door-portage';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'fawley-overhead-door-portage';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Portage' FROM companies WHERE slug = 'fawley-overhead-door-portage';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'fawley-overhead-door-three-rivers-three-rivers',
  'Fawley Overhead Door - Three Rivers',
  5.0, 104, 'Three Rivers, MI', 'three-rivers',
  '["Repair", "Installation"]',
  0, 0,
  'Fawley Overhead Door - Three Rivers provides garage door installation and service/repair in Three Rivers, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '269-443-1093', NULL,
  '145 W Michigan Ave, Three Rivers, MI 49093', NULL,
  'https://www.google.com/maps/search/?api=1&query=Fawley+Overhead+Door+-+Three+Rivers+145+W+Michigan+Ave%2C+Three+Rivers%2C+MI+49093+Michigan', 'Current Business Index', 'High', 'Kalamazoo / Southwest Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'fawley-overhead-door-three-rivers-three-rivers';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'fawley-overhead-door-three-rivers-three-rivers';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'fawley-overhead-door-three-rivers-three-rivers';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'fawley-overhead-door-three-rivers-three-rivers';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'fawley-overhead-door-three-rivers-three-rivers';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Three Rivers' FROM companies WHERE slug = 'fawley-overhead-door-three-rivers-three-rivers';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Kalamazoo' FROM companies WHERE slug = 'fawley-overhead-door-three-rivers-three-rivers';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Portage' FROM companies WHERE slug = 'fawley-overhead-door-three-rivers-three-rivers';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Battle Creek' FROM companies WHERE slug = 'fawley-overhead-door-three-rivers-three-rivers';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'fix-a-go-garage-door-repair',
  'Fix a Go Garage Door Repair',
  4.9, 139, 'Grand Rapids, MI', 'grand-rapids',
  '["Repair", "Springs", "Emergency"]',
  0, 1,
  'Fix a Go Garage Door Repair specializes in residential spring and opener repairs with responsive scheduling across Grand Rapids.',
  'Mon–Sat, 7am–7pm', 'After-hours available', '877-869-3135', NULL,
  '439 Harp St SE, Grand Rapids, MI 49548', NULL,
  'https://www.google.com/maps/search/?api=1&query=Fix+a+go+Garage+Door+Repair+439+Harp+St+SE%2C+Grand+Rapids%2C+MI+49548+Michigan', 'Current Business Index', 'High', 'Grand Rapids / West Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'fix-a-go-garage-door-repair';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'fix-a-go-garage-door-repair';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'fix-a-go-garage-door-repair';
INSERT INTO company_services (company_id, service) SELECT id, 'Emergency Service' FROM companies WHERE slug = 'fix-a-go-garage-door-repair';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Grand Rapids' FROM companies WHERE slug = 'fix-a-go-garage-door-repair';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Wyoming' FROM companies WHERE slug = 'fix-a-go-garage-door-repair';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Kentwood' FROM companies WHERE slug = 'fix-a-go-garage-door-repair';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Walker' FROM companies WHERE slug = 'fix-a-go-garage-door-repair';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'fjf-door-sales-clinton-township',
  'FJF Door Sales',
  0.0, 0, 'Clinton Township, MI', 'clinton-township',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'FJF Door Sales provides garage door installation and service/repair in Clinton Township, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '586-468-9787', NULL,
  '43678 NORTH GRATIOT AVENUE, CLINTON TOWNSHIP, MI 48036-3330', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-1-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'fjf-door-sales-clinton-township';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'fjf-door-sales-clinton-township';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'fjf-door-sales-clinton-township';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'fjf-door-sales-clinton-township';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'fjf-door-sales-clinton-township';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Clinton Township' FROM companies WHERE slug = 'fjf-door-sales-clinton-township';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'flint-area-overhead-door',
  'Flint Area Overhead Door',
  4.6, 52, 'Grand Blanc, MI', 'grand-blanc',
  '["Repair", "Installation", "Commercial"]',
  0, 0,
  'Flint Area Overhead Door provides residential and commercial garage door service throughout Genesee County.',
  'Mon–Fri, 7am–5pm', NULL, NULL, NULL,
  NULL, NULL,
  NULL, NULL, NULL, NULL, NULL,
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'flint-area-overhead-door';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'flint-area-overhead-door';
INSERT INTO company_services (company_id, service) SELECT id, 'Commercial Service' FROM companies WHERE slug = 'flint-area-overhead-door';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'flint-area-overhead-door';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'flint-area-overhead-door';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'flint-area-overhead-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Grand Blanc' FROM companies WHERE slug = 'flint-area-overhead-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Flint' FROM companies WHERE slug = 'flint-area-overhead-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Burton' FROM companies WHERE slug = 'flint-area-overhead-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Fenton' FROM companies WHERE slug = 'flint-area-overhead-door';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'four-seasons-garage-door-service-marquette',
  'Four Seasons Garage Door Service',
  5.0, 1, 'Marquette, MI', 'marquette',
  '["Repair", "Installation"]',
  0, 0,
  'Four Seasons Garage Door Service provides garage door installation and service/repair in Marquette, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '906-361-2449', NULL,
  NULL, NULL,
  'https://www.google.com/maps/search/?api=1&query=Four+Seasons+Garage+Door+Service+Marquette+Michigan', 'Current Business Index', 'Medium', 'Upper Peninsula', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'four-seasons-garage-door-service-marquette';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'four-seasons-garage-door-service-marquette';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'four-seasons-garage-door-service-marquette';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'four-seasons-garage-door-service-marquette';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'four-seasons-garage-door-service-marquette';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Marquette' FROM companies WHERE slug = 'four-seasons-garage-door-service-marquette';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'gabbard-overhead-door-laingsburg',
  'Gabbard Overhead Door',
  0.0, 0, 'Laingsburg, MI', 'laingsburg',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'Gabbard Overhead Door provides garage door installation and service/repair in Laingsburg, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '517-651-2412', NULL,
  '8733 COLBY LAKE ROAD, LAINGSBURG, MI 48848-9726', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-1-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'gabbard-overhead-door-laingsburg';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'gabbard-overhead-door-laingsburg';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'gabbard-overhead-door-laingsburg';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'gabbard-overhead-door-laingsburg';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'gabbard-overhead-door-laingsburg';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Laingsburg' FROM companies WHERE slug = 'gabbard-overhead-door-laingsburg';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'garage-door-md',
  'Garage Door MD',
  5.0, 11, 'Detroit, MI', 'detroit',
  '["Repair", "Installation", "Commercial", "Emergency"]',
  0, 1,
  'Garage Door MD handles residential and commercial garage door repair and replacement across the Detroit metro with competitive pricing and clear communication.',
  'Mon–Fri, 8am–6pm', 'Emergency services offered', NULL, NULL,
  NULL, NULL,
  NULL, NULL, NULL, NULL, NULL,
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'garage-door-md';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'garage-door-md';
INSERT INTO company_services (company_id, service) SELECT id, 'Commercial Service' FROM companies WHERE slug = 'garage-door-md';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'garage-door-md';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'garage-door-md';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'garage-door-md';
INSERT INTO company_services (company_id, service) SELECT id, 'Emergency Service' FROM companies WHERE slug = 'garage-door-md';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Detroit' FROM companies WHERE slug = 'garage-door-md';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Warren' FROM companies WHERE slug = 'garage-door-md';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Sterling Heights' FROM companies WHERE slug = 'garage-door-md';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Troy' FROM companies WHERE slug = 'garage-door-md';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'garage-door-pros-ann-arbor',
  'Garage Door Pros',
  4.5, 52, 'Ann Arbor, MI', 'ann-arbor',
  '["Repair", "Installation"]',
  0, 0,
  'Garage Door Pros provides garage door installation and service/repair in Ann Arbor, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '734-436-2042', NULL,
  '3864 Trade Center Dr, Ann Arbor, MI 48108', NULL,
  'https://www.google.com/maps/search/?api=1&query=Garage+Door+Pros+3864+Trade+Center+Dr%2C+Ann+Arbor%2C+MI+48108+Michigan', 'Current Business Index', 'High', 'Ann Arbor / Livingston', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'garage-door-pros-ann-arbor';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'garage-door-pros-ann-arbor';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'garage-door-pros-ann-arbor';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'garage-door-pros-ann-arbor';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'garage-door-pros-ann-arbor';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Ann Arbor' FROM companies WHERE slug = 'garage-door-pros-ann-arbor';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Ypsilanti' FROM companies WHERE slug = 'garage-door-pros-ann-arbor';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Brighton' FROM companies WHERE slug = 'garage-door-pros-ann-arbor';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Howell' FROM companies WHERE slug = 'garage-door-pros-ann-arbor';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'garage-door-pros-brighton',
  'Garage Door Pros',
  5.0, 432, 'Brighton, MI', 'brighton',
  '["Repair", "Installation"]',
  0, 0,
  'Garage Door Pros provides garage door installation and service/repair in Brighton, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '810-206-1997', NULL,
  '818 W Grand River Ave, Brighton, MI 48116', NULL,
  'https://www.google.com/maps/search/?api=1&query=Garage+Door+Pros+818+W+Grand+River+Ave%2C+Brighton%2C+MI+48116+Michigan', 'Current Business Index', 'High', 'Ann Arbor / Livingston', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'garage-door-pros-brighton';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'garage-door-pros-brighton';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'garage-door-pros-brighton';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'garage-door-pros-brighton';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'garage-door-pros-brighton';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Brighton' FROM companies WHERE slug = 'garage-door-pros-brighton';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Ann Arbor' FROM companies WHERE slug = 'garage-door-pros-brighton';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Ypsilanti' FROM companies WHERE slug = 'garage-door-pros-brighton';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Howell' FROM companies WHERE slug = 'garage-door-pros-brighton';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'garage-door-pros-trenton-trenton',
  'Garage Door Pros - Trenton',
  5.0, 491, 'Trenton, MI', 'trenton',
  '["Repair", "Installation"]',
  0, 0,
  'Garage Door Pros - Trenton provides garage door installation and service/repair in Trenton, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '734-499-0899', NULL,
  '1600 Kingsway Ct Unit 101-E, Trenton, MI 48183', NULL,
  'https://www.google.com/maps/search/?api=1&query=Garage+Door+Pros+-+Trenton+1600+Kingsway+Ct+Unit+101-E%2C+Trenton%2C+MI+48183+Michigan', 'Current Business Index', 'High', 'Port Huron / St. Clair-Macomb', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'garage-door-pros-trenton-trenton';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'garage-door-pros-trenton-trenton';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'garage-door-pros-trenton-trenton';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'garage-door-pros-trenton-trenton';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'garage-door-pros-trenton-trenton';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Trenton' FROM companies WHERE slug = 'garage-door-pros-trenton-trenton';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Port Huron' FROM companies WHERE slug = 'garage-door-pros-trenton-trenton';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Clinton Township' FROM companies WHERE slug = 'garage-door-pros-trenton-trenton';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Shelby Township' FROM companies WHERE slug = 'garage-door-pros-trenton-trenton';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'garage-door-services-traverse-city',
  'Garage Door Services',
  4.7, 128, 'Traverse City, MI', 'traverse-city',
  '["Repair", "Installation", "Openers", "Commercial"]',
  0, 0,
  'Garage Door Services has served greater Grand Traverse County for more than 35 years from 2550 Preston Dr in Traverse City, offering residential and commercial installation and repair with Raynor, Haas, Clopay, and LiftMaster products.',
  'Mon–Fri, 8am–4:30pm', NULL, NULL, NULL,
  NULL, 'https://www.garagedoorservicesinc.com/',
  NULL, NULL, NULL, NULL, NULL,
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'garage-door-services-traverse-city';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'garage-door-services-traverse-city';
INSERT INTO company_services (company_id, service) SELECT id, 'Commercial Service' FROM companies WHERE slug = 'garage-door-services-traverse-city';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'garage-door-services-traverse-city';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'garage-door-services-traverse-city';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'garage-door-services-traverse-city';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Traverse City' FROM companies WHERE slug = 'garage-door-services-traverse-city';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Acme' FROM companies WHERE slug = 'garage-door-services-traverse-city';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Interlochen' FROM companies WHERE slug = 'garage-door-services-traverse-city';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Kingsley' FROM companies WHERE slug = 'garage-door-services-traverse-city';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Elk Rapids' FROM companies WHERE slug = 'garage-door-services-traverse-city';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Cadillac' FROM companies WHERE slug = 'garage-door-services-traverse-city';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'garage-door-services-traverse-city-2',
  'Garage Door Services',
  3.4, 16, 'Traverse City, MI', 'traverse-city',
  '["Repair", "Installation"]',
  0, 0,
  'Garage Door Services provides garage door installation and service/repair in Traverse City, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '231-947-5151', NULL,
  '2550 Preston Dr, Traverse City, MI 49684', NULL,
  'https://www.google.com/maps/search/?api=1&query=Garage+Door+Services+2550+Preston+Dr%2C+Traverse+City%2C+MI+49684+Michigan', 'Current Business Index', 'High', 'Traverse City / Northern Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'garage-door-services-traverse-city-2';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'garage-door-services-traverse-city-2';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'garage-door-services-traverse-city-2';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'garage-door-services-traverse-city-2';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'garage-door-services-traverse-city-2';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Traverse City' FROM companies WHERE slug = 'garage-door-services-traverse-city-2';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Cadillac' FROM companies WHERE slug = 'garage-door-services-traverse-city-2';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Petoskey' FROM companies WHERE slug = 'garage-door-services-traverse-city-2';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'garage-door-specialist-spring-lake',
  'Garage Door Specialist',
  5.0, 90, 'Spring Lake, MI', 'spring-lake',
  '["Repair", "Installation"]',
  0, 0,
  'Garage Door Specialist provides garage door installation and service/repair in Spring Lake, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '616-842-7352', NULL,
  '14860 Michael Ln, Spring Lake, MI 49456', NULL,
  'https://www.google.com/maps/search/?api=1&query=Garage+Door+Specialist+14860+Michael+Ln%2C+Spring+Lake%2C+MI+49456+Michigan', 'Current Business Index', 'High', 'Muskegon / Lakeshore', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'garage-door-specialist-spring-lake';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'garage-door-specialist-spring-lake';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'garage-door-specialist-spring-lake';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'garage-door-specialist-spring-lake';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'garage-door-specialist-spring-lake';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Spring Lake' FROM companies WHERE slug = 'garage-door-specialist-spring-lake';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Muskegon' FROM companies WHERE slug = 'garage-door-specialist-spring-lake';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Norton Shores' FROM companies WHERE slug = 'garage-door-specialist-spring-lake';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Holland' FROM companies WHERE slug = 'garage-door-specialist-spring-lake';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'garage-doors-and-more-llc-vicksburg',
  'Garage Doors and More LLC',
  4.8, 23, 'Vicksburg, MI', 'vicksburg',
  '["Repair", "Installation"]',
  0, 0,
  'Garage Doors and More LLC provides garage door installation and service/repair in Vicksburg, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '269-207-3448', NULL,
  NULL, NULL,
  'https://www.google.com/maps/search/?api=1&query=Garage+Doors+and+More+LLC+Vicksburg+Michigan', 'Current Business Index', 'High', 'Kalamazoo / Southwest Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'garage-doors-and-more-llc-vicksburg';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'garage-doors-and-more-llc-vicksburg';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'garage-doors-and-more-llc-vicksburg';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'garage-doors-and-more-llc-vicksburg';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'garage-doors-and-more-llc-vicksburg';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Vicksburg' FROM companies WHERE slug = 'garage-doors-and-more-llc-vicksburg';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Kalamazoo' FROM companies WHERE slug = 'garage-doors-and-more-llc-vicksburg';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Portage' FROM companies WHERE slug = 'garage-doors-and-more-llc-vicksburg';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Battle Creek' FROM companies WHERE slug = 'garage-doors-and-more-llc-vicksburg';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'garage-doors-done-right',
  'Garage Doors Done Right',
  4.8, 27, 'Cedar, MI', 'traverse-city',
  '["Repair", "Installation", "Springs"]',
  0, 0,
  'Garage Doors Done Right serves Cedar, Traverse City, and Leelanau County homeowners with residential garage door repair, spring replacement, and new door installation.',
  'Mon–Fri, 8am–5pm', NULL, NULL, NULL,
  NULL, NULL,
  NULL, NULL, NULL, NULL, NULL,
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'garage-doors-done-right';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'garage-doors-done-right';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'garage-doors-done-right';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'garage-doors-done-right';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'garage-doors-done-right';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Cedar' FROM companies WHERE slug = 'garage-doors-done-right';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Traverse City' FROM companies WHERE slug = 'garage-doors-done-right';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Suttons Bay' FROM companies WHERE slug = 'garage-doors-done-right';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Empire' FROM companies WHERE slug = 'garage-doors-done-right';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Interlochen' FROM companies WHERE slug = 'garage-doors-done-right';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'garage-doors-done-right-cedar',
  'Garage Doors Done Right',
  5.0, 31, 'Cedar, MI', 'cedar',
  '["Repair", "Installation"]',
  0, 0,
  'Garage Doors Done Right provides garage door installation and service/repair in Cedar, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '231-633-2990', NULL,
  '6663 S Lime Lake Rd, Cedar, MI 49621', NULL,
  'https://www.google.com/maps/search/?api=1&query=Garage+Doors+Done+Right+6663+S+Lime+Lake+Rd%2C+Cedar%2C+MI+49621+Michigan', 'Current Business Index', 'High', 'Traverse City / Northern Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'garage-doors-done-right-cedar';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'garage-doors-done-right-cedar';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'garage-doors-done-right-cedar';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'garage-doors-done-right-cedar';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'garage-doors-done-right-cedar';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Cedar' FROM companies WHERE slug = 'garage-doors-done-right-cedar';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Traverse City' FROM companies WHERE slug = 'garage-doors-done-right-cedar';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Cadillac' FROM companies WHERE slug = 'garage-doors-done-right-cedar';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Petoskey' FROM companies WHERE slug = 'garage-doors-done-right-cedar';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'garage-doors-plus-muskegon',
  'Garage Doors Plus',
  5.0, 10, 'Muskegon, MI', 'muskegon',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'Garage Doors Plus provides garage door installation and service/repair in Muskegon, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '231-777-3998', NULL,
  '3041 Heights Ravenna Rd, Muskegon, MI 49444', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-2-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance. Cross-checked against a current 2026 business-index result. Clopay directory lists: 3074 Heights Ravenna Rd, MUSKEGON, MI 49444.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'garage-doors-plus-muskegon';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'garage-doors-plus-muskegon';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'garage-doors-plus-muskegon';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'garage-doors-plus-muskegon';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'garage-doors-plus-muskegon';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Muskegon' FROM companies WHERE slug = 'garage-doors-plus-muskegon';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'gary-garage-door-llc-kalamazoo',
  'Gary Garage Door LLC',
  4.6, 55, 'Kalamazoo, MI', 'kalamazoo',
  '["Repair", "Installation"]',
  0, 0,
  'Gary Garage Door LLC provides garage door installation and service/repair in Kalamazoo, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '269-575-6564', NULL,
  '5166 Pathfinder St Unit 110, Kalamazoo, MI 49009', NULL,
  'https://www.google.com/maps/search/?api=1&query=GARY+GARAGE+DOOR+LLC+5166+Pathfinder+St+Unit+110%2C+Kalamazoo%2C+MI+49009+Michigan', 'Current Business Index', 'High', 'Kalamazoo / Southwest Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'gary-garage-door-llc-kalamazoo';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'gary-garage-door-llc-kalamazoo';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'gary-garage-door-llc-kalamazoo';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'gary-garage-door-llc-kalamazoo';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'gary-garage-door-llc-kalamazoo';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Kalamazoo' FROM companies WHERE slug = 'gary-garage-door-llc-kalamazoo';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Portage' FROM companies WHERE slug = 'gary-garage-door-llc-kalamazoo';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Battle Creek' FROM companies WHERE slug = 'gary-garage-door-llc-kalamazoo';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'gdm-garage-door-service-freeland',
  'GDM Garage Door Service',
  4.9, 67, 'Freeland, MI', 'freeland',
  '["Repair", "Installation"]',
  0, 0,
  'GDM Garage Door Service provides garage door installation and service/repair in Freeland, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '989-525-3446', NULL,
  '9612 Tittabawassee Rd, Freeland, MI 48623', NULL,
  'https://www.google.com/maps/search/?api=1&query=GDM+Garage+Door+Service+9612+Tittabawassee+Rd%2C+Freeland%2C+MI+48623+Michigan', 'Current Business Index', 'High', 'Saginaw / Great Lakes Bay', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'gdm-garage-door-service-freeland';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'gdm-garage-door-service-freeland';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'gdm-garage-door-service-freeland';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'gdm-garage-door-service-freeland';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'gdm-garage-door-service-freeland';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Freeland' FROM companies WHERE slug = 'gdm-garage-door-service-freeland';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Saginaw' FROM companies WHERE slug = 'gdm-garage-door-service-freeland';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Bay City' FROM companies WHERE slug = 'gdm-garage-door-service-freeland';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Midland' FROM companies WHERE slug = 'gdm-garage-door-service-freeland';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'genesee-county-garage-doors',
  'Genesee County Garage Doors',
  4.7, 83, 'Flint, MI', 'flint',
  '["Repair", "Springs", "Installation"]',
  0, 0,
  'Genesee County Garage Doors serves Flint, Grand Blanc, and surrounding communities with residential repair, springs, and new door installs.',
  'Mon–Sat, 7am–6pm', NULL, NULL, NULL,
  NULL, NULL,
  NULL, NULL, NULL, NULL, NULL,
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'genesee-county-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'genesee-county-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'genesee-county-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'genesee-county-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'genesee-county-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Flint' FROM companies WHERE slug = 'genesee-county-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Grand Blanc' FROM companies WHERE slug = 'genesee-county-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Burton' FROM companies WHERE slug = 'genesee-county-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Fenton' FROM companies WHERE slug = 'genesee-county-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Davison' FROM companies WHERE slug = 'genesee-county-garage-doors';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'grand-river-garage-door-lansing',
  'Grand River Garage Door',
  5.0, 267, 'Lansing, MI', 'lansing',
  '["Repair", "Installation"]',
  0, 0,
  'Grand River Garage Door provides garage door installation and service/repair in Lansing, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '517-325-9005', NULL,
  '3022 Vine St, Lansing, MI 48912', NULL,
  'https://www.google.com/maps/search/?api=1&query=Grand+River+Garage+Door+3022+Vine+St%2C+Lansing%2C+MI+48912+Michigan', 'Current Business Index', 'High', 'Lansing / Mid-Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'grand-river-garage-door-lansing';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'grand-river-garage-door-lansing';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'grand-river-garage-door-lansing';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'grand-river-garage-door-lansing';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'grand-river-garage-door-lansing';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Lansing' FROM companies WHERE slug = 'grand-river-garage-door-lansing';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'East Lansing' FROM companies WHERE slug = 'grand-river-garage-door-lansing';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Jackson' FROM companies WHERE slug = 'grand-river-garage-door-lansing';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'great-lakes-overhead-door-menominee',
  'Great Lakes Overhead Door',
  4.9, 37, 'Menominee, MI', 'menominee',
  '["Repair", "Installation"]',
  0, 0,
  'Great Lakes Overhead Door provides garage door installation and service/repair in Menominee, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '906-864-1999', NULL,
  '4217 13th St, Menominee, MI 49858', NULL,
  'https://www.google.com/maps/search/?api=1&query=Great+Lakes+Overhead+Door+4217+13th+St%2C+Menominee%2C+MI+49858+Michigan', 'Current Business Index', 'High', 'Upper Peninsula', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'great-lakes-overhead-door-menominee';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'great-lakes-overhead-door-menominee';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'great-lakes-overhead-door-menominee';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'great-lakes-overhead-door-menominee';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'great-lakes-overhead-door-menominee';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Menominee' FROM companies WHERE slug = 'great-lakes-overhead-door-menominee';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Marquette' FROM companies WHERE slug = 'great-lakes-overhead-door-menominee';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'hallzys-garage-door',
  'Hallzy''s Garage Door',
  4.9, 48, 'Thompsonville, MI', 'traverse-city',
  '["Repair", "Installation", "Openers", "Emergency"]',
  0, 1,
  'Hallzy''s Garage Door LLC provides garage door installation, repair, openers, and 24-hour emergency service from Thompsonville across Grand Traverse, Benzie, Manistee, Kalkaska, Leelanau, Lake, and Mason counties.',
  'Mon–Sat, 7am–6pm', '24-hour emergency repairs', '231-970-1350', NULL,
  '14589 Judson Ave, Thompsonville, MI 49683', 'https://www.hallzysgaragedoor.com/',
  'https://www.google.com/maps/search/?api=1&query=Hallzy%27s+Garage+Door+LLC+14589+Judson+Ave%2C+Thompsonville%2C+MI+49683+Michigan', 'Current Business Index', 'High', 'Traverse City / Northern Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'hallzys-garage-door';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'hallzys-garage-door';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'hallzys-garage-door';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'hallzys-garage-door';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'hallzys-garage-door';
INSERT INTO company_services (company_id, service) SELECT id, 'Emergency Service' FROM companies WHERE slug = 'hallzys-garage-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Traverse City' FROM companies WHERE slug = 'hallzys-garage-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Thompsonville' FROM companies WHERE slug = 'hallzys-garage-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Interlochen' FROM companies WHERE slug = 'hallzys-garage-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Cadillac' FROM companies WHERE slug = 'hallzys-garage-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Frankfort' FROM companies WHERE slug = 'hallzys-garage-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Manistee' FROM companies WHERE slug = 'hallzys-garage-door';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'holton-garage-doors-holton',
  'Holton Garage Doors',
  0.0, 0, 'Holton, MI', 'holton',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'Holton Garage Doors provides garage door installation and service/repair in Holton, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '231-821-0060', NULL,
  '8207 HOLTON ROAD, HOLTON, MI 49425-8567', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-2-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'holton-garage-doors-holton';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'holton-garage-doors-holton';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'holton-garage-doors-holton';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'holton-garage-doors-holton';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'holton-garage-doors-holton';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Holton' FROM companies WHERE slug = 'holton-garage-doors-holton';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'hometown-doors-inc-manton',
  'Hometown Doors Inc',
  0.0, 0, 'Manton, MI', 'manton',
  '["Repair", "Installation"]',
  0, 0,
  'Hometown Doors Inc provides garage door installation and service/repair in Manton, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '231-779-9961', NULL,
  '1917 N 41 1/2 Rd, Manton, MI 49663', NULL,
  'https://www.google.com/maps/search/?api=1&query=Hometown+Doors+Inc+1917+N+41+1%2F2+Rd%2C+Manton%2C+MI+49663+Michigan', 'Current Business Index', 'Medium', 'Traverse City / Northern Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'hometown-doors-inc-manton';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'hometown-doors-inc-manton';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'hometown-doors-inc-manton';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'hometown-doors-inc-manton';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'hometown-doors-inc-manton';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Manton' FROM companies WHERE slug = 'hometown-doors-inc-manton';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Traverse City' FROM companies WHERE slug = 'hometown-doors-inc-manton';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Cadillac' FROM companies WHERE slug = 'hometown-doors-inc-manton';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Petoskey' FROM companies WHERE slug = 'hometown-doors-inc-manton';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'horizon-overhead-door-llc-cass-city',
  'Horizon Overhead Door, LLC',
  5.0, 372, 'Cass City, MI', 'cass-city',
  '["Repair", "Installation"]',
  0, 0,
  'Horizon Overhead Door, LLC provides garage door installation and service/repair in Cass City, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '989-864-2286', NULL,
  NULL, NULL,
  'https://www.google.com/maps/search/?api=1&query=Horizon+Overhead+Door%2C+LLC+Cass+City+Michigan', 'Current Business Index', 'High', 'Saginaw / Great Lakes Bay', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'horizon-overhead-door-llc-cass-city';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'horizon-overhead-door-llc-cass-city';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'horizon-overhead-door-llc-cass-city';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'horizon-overhead-door-llc-cass-city';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'horizon-overhead-door-llc-cass-city';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Cass City' FROM companies WHERE slug = 'horizon-overhead-door-llc-cass-city';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Saginaw' FROM companies WHERE slug = 'horizon-overhead-door-llc-cass-city';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Bay City' FROM companies WHERE slug = 'horizon-overhead-door-llc-cass-city';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Midland' FROM companies WHERE slug = 'horizon-overhead-door-llc-cass-city';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'hunter-garage-doors-mcmillan',
  'Hunter Garage Doors',
  0.0, 0, 'McMillan, MI', 'mcmillan',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'Hunter Garage Doors provides garage door installation and service/repair in McMillan, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '906-293-6058', NULL,
  '3686 County Rd 379, McMillan, MI 49853', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-2-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance. Cross-checked against a current 2026 business-index result. Clopay directory lists: W16825 Sandtown Road, Curtis, MI 49820-9629.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'hunter-garage-doors-mcmillan';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'hunter-garage-doors-mcmillan';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'hunter-garage-doors-mcmillan';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'hunter-garage-doors-mcmillan';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'hunter-garage-doors-mcmillan';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'McMillan' FROM companies WHERE slug = 'hunter-garage-doors-mcmillan';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'ingstrup-construction-inc-lansing',
  'Ingstrup Construction Inc',
  0.0, 0, 'Lansing, MI', 'lansing',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'Ingstrup Construction Inc provides garage door installation and service/repair in Lansing, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '517-374-4731', NULL,
  '4624 S CREYTS RD, LANSING, MI 48917-8596', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-2-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'ingstrup-construction-inc-lansing';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'ingstrup-construction-inc-lansing';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'ingstrup-construction-inc-lansing';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'ingstrup-construction-inc-lansing';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'ingstrup-construction-inc-lansing';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Lansing' FROM companies WHERE slug = 'ingstrup-construction-inc-lansing';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'j-maki-door-services-negaunee',
  'J Maki Door Services',
  4.6, 13, 'Negaunee, MI', 'negaunee',
  '["Repair", "Installation"]',
  0, 0,
  'J Maki Door Services provides garage door installation and service/repair in Negaunee, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '906-226-7466', NULL,
  '86 Midway Dr, Negaunee, MI 49866', NULL,
  'https://www.google.com/maps/search/?api=1&query=J+Maki+Door+Services+86+Midway+Dr%2C+Negaunee%2C+MI+49866+Michigan', 'Current Business Index', 'High', 'Upper Peninsula', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'j-maki-door-services-negaunee';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'j-maki-door-services-negaunee';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'j-maki-door-services-negaunee';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'j-maki-door-services-negaunee';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'j-maki-door-services-negaunee';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Negaunee' FROM companies WHERE slug = 'j-maki-door-services-negaunee';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Marquette' FROM companies WHERE slug = 'j-maki-door-services-negaunee';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'j-j-garage-door-service-saginaw',
  'J&J Garage Door Service',
  4.6, 9, 'Saginaw, MI', 'saginaw',
  '["Repair", "Installation"]',
  0, 0,
  'J&J Garage Door Service provides garage door installation and service/repair in Saginaw, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '989-980-9886', NULL,
  '1720 State St, Saginaw, MI 48602', NULL,
  'https://www.google.com/maps/search/?api=1&query=J%26J+Garage+Door+Service+1720+State+St%2C+Saginaw%2C+MI+48602+Michigan', 'Current Business Index', 'Medium', 'Saginaw / Great Lakes Bay', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'j-j-garage-door-service-saginaw';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'j-j-garage-door-service-saginaw';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'j-j-garage-door-service-saginaw';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'j-j-garage-door-service-saginaw';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'j-j-garage-door-service-saginaw';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Saginaw' FROM companies WHERE slug = 'j-j-garage-door-service-saginaw';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Bay City' FROM companies WHERE slug = 'j-j-garage-door-service-saginaw';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Midland' FROM companies WHERE slug = 'j-j-garage-door-service-saginaw';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'jackson-garage-door-pros',
  'Jackson Garage Door Pros',
  4.6, 37, 'Jackson, MI', 'jackson',
  '["Repair", "Springs", "Openers"]',
  0, 0,
  'Jackson Garage Door Pros serves Jackson and nearby mid-Michigan towns with residential spring, opener, and door repair.',
  'Mon–Fri, 8am–5pm', NULL, NULL, NULL,
  NULL, NULL,
  NULL, NULL, NULL, NULL, NULL,
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'jackson-garage-door-pros';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'jackson-garage-door-pros';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'jackson-garage-door-pros';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'jackson-garage-door-pros';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'jackson-garage-door-pros';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Jackson' FROM companies WHERE slug = 'jackson-garage-door-pros';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Ann Arbor' FROM companies WHERE slug = 'jackson-garage-door-pros';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Lansing' FROM companies WHERE slug = 'jackson-garage-door-pros';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Battle Creek' FROM companies WHERE slug = 'jackson-garage-door-pros';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'jcl-doors-windows-llc-clio',
  'Jcl Doors & Windows LLC',
  5.0, 5, 'Clio, MI', 'clio',
  '["Repair", "Installation"]',
  0, 0,
  'Jcl Doors & Windows LLC provides garage door installation and service/repair in Clio, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '810-686-3455', NULL,
  '11325 N Saginaw Rd, Clio, MI 48420', NULL,
  'https://www.google.com/maps/search/?api=1&query=JCL+DOORS+%26+WINDOWS+LLC+11325+N+Saginaw+Rd%2C+Clio%2C+MI+48420+Michigan', 'Current Business Index', 'Medium', 'Flint / Genesee / Lapeer', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'jcl-doors-windows-llc-clio';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'jcl-doors-windows-llc-clio';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'jcl-doors-windows-llc-clio';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'jcl-doors-windows-llc-clio';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'jcl-doors-windows-llc-clio';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Clio' FROM companies WHERE slug = 'jcl-doors-windows-llc-clio';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Flint' FROM companies WHERE slug = 'jcl-doors-windows-llc-clio';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Grand Blanc' FROM companies WHERE slug = 'jcl-doors-windows-llc-clio';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Fenton' FROM companies WHERE slug = 'jcl-doors-windows-llc-clio';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'jm-door-llc-grayling',
  'Jm Door LLC',
  0.0, 0, 'Grayling, MI', 'grayling',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'Jm Door LLC provides garage door installation and service/repair in Grayling, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '989-348-6218', NULL,
  '6289 West M-72, Grayling, MI 49738-6480', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-2-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'jm-door-llc-grayling';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'jm-door-llc-grayling';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'jm-door-llc-grayling';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'jm-door-llc-grayling';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'jm-door-llc-grayling';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Grayling' FROM companies WHERE slug = 'jm-door-llc-grayling';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'johnson-door-central-vacuum-systems-mount-pleasant',
  'Johnson Door-Central Vacuum Systems',
  0.0, 0, 'Mount Pleasant, MI', 'mount-pleasant',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'Johnson Door-Central Vacuum Systems provides garage door installation and service/repair in Mount Pleasant, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '989-772-3155', NULL,
  '811 CRAIG HILL ROAD, MOUNT PLEASANT, MI 48858', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-2-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'johnson-door-central-vacuum-systems-mount-pleasant';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'johnson-door-central-vacuum-systems-mount-pleasant';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'johnson-door-central-vacuum-systems-mount-pleasant';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'johnson-door-central-vacuum-systems-mount-pleasant';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'johnson-door-central-vacuum-systems-mount-pleasant';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Mount Pleasant' FROM companies WHERE slug = 'johnson-door-central-vacuum-systems-mount-pleasant';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'jones-jones-garage-door-service-harbor-springs',
  'Jones & Jones Garage Door Service',
  0.0, 0, 'Harbor Springs, MI', 'harbor-springs',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'Jones & Jones Garage Door Service provides garage door installation and service/repair in Harbor Springs, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '231-633-0204', NULL,
  '7616 Sophies Way, Harbor Springs, MI 49740-8658', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-2-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'jones-jones-garage-door-service-harbor-springs';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'jones-jones-garage-door-service-harbor-springs';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'jones-jones-garage-door-service-harbor-springs';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'jones-jones-garage-door-service-harbor-springs';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'jones-jones-garage-door-service-harbor-springs';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Harbor Springs' FROM companies WHERE slug = 'jones-jones-garage-door-service-harbor-springs';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'just-us-garage-service',
  'Just Us Garage Service',
  4.8, 18, 'Detroit, MI', 'detroit',
  '["Repair", "Installation", "Emergency"]',
  0, 1,
  'Just Us Garage Service provides residential and commercial garage door repair, installation, and maintenance throughout Southeast Michigan with transparent pricing.',
  'Mon–Sat, 7am–7pm', 'Emergency services offered', NULL, NULL,
  NULL, NULL,
  NULL, NULL, NULL, NULL, NULL,
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'just-us-garage-service';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'just-us-garage-service';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'just-us-garage-service';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'just-us-garage-service';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'just-us-garage-service';
INSERT INTO company_services (company_id, service) SELECT id, 'Emergency Service' FROM companies WHERE slug = 'just-us-garage-service';
INSERT INTO company_services (company_id, service) SELECT id, 'Commercial Service' FROM companies WHERE slug = 'just-us-garage-service';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Detroit' FROM companies WHERE slug = 'just-us-garage-service';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Warren' FROM companies WHERE slug = 'just-us-garage-service';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Sterling Heights' FROM companies WHERE slug = 'just-us-garage-service';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Troy' FROM companies WHERE slug = 'just-us-garage-service';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Livonia' FROM companies WHERE slug = 'just-us-garage-service';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Ann Arbor' FROM companies WHERE slug = 'just-us-garage-service';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'k-h-garage-doors-fenton',
  'K & H Garage Doors',
  5.0, 9, 'Fenton, MI', 'fenton',
  '["Repair", "Installation"]',
  0, 0,
  'K & H Garage Doors provides garage door installation and service/repair in Fenton, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '810-629-1293', NULL,
  '2033 S Long Lake Rd, Fenton, MI 48430', NULL,
  'https://www.google.com/maps/search/?api=1&query=K+%26+H+Garage+Doors+2033+S+Long+Lake+Rd%2C+Fenton%2C+MI+48430+Michigan', 'Current Business Index', 'Medium', 'Flint / Genesee / Lapeer', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'k-h-garage-doors-fenton';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'k-h-garage-doors-fenton';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'k-h-garage-doors-fenton';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'k-h-garage-doors-fenton';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'k-h-garage-doors-fenton';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Fenton' FROM companies WHERE slug = 'k-h-garage-doors-fenton';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Flint' FROM companies WHERE slug = 'k-h-garage-doors-fenton';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Grand Blanc' FROM companies WHERE slug = 'k-h-garage-doors-fenton';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'k-r-garage-door-service-almont',
  'K&R Garage Door Service',
  0.0, 0, 'Almont, MI', 'almont',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'K&R Garage Door Service provides garage door installation and service/repair in Almont, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '810-798-0596', NULL,
  '6944 TALBOT DRIVE, ALMONT, MI 48003', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-2-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'k-r-garage-door-service-almont';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'k-r-garage-door-service-almont';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'k-r-garage-door-service-almont';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'k-r-garage-door-service-almont';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'k-r-garage-door-service-almont';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Almont' FROM companies WHERE slug = 'k-r-garage-door-service-almont';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'keweenaw-overhead-door-houghton',
  'Keweenaw Overhead Door',
  0.0, 0, 'Houghton, MI', 'houghton',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'Keweenaw Overhead Door provides garage door installation and service/repair in Houghton, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '906-483-3791', NULL,
  '19825 Sharon Avenue, Houghton, MI 49931-2520', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-2-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'keweenaw-overhead-door-houghton';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'keweenaw-overhead-door-houghton';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'keweenaw-overhead-door-houghton';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'keweenaw-overhead-door-houghton';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'keweenaw-overhead-door-houghton';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Houghton' FROM companies WHERE slug = 'keweenaw-overhead-door-houghton';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'lakeshore-garage-door-service',
  'Lakeshore Garage Door Service',
  4.8, 91, 'Holland, MI', 'holland',
  '["Repair", "Installation", "Openers"]',
  0, 0,
  'Lakeshore Garage Door Service serves Holland, Zeeland, and the lakeshore corridor with residential garage door repair and installation.',
  'Mon–Fri, 7am–6pm', NULL, NULL, NULL,
  NULL, NULL,
  NULL, NULL, NULL, NULL, NULL,
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'lakeshore-garage-door-service';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'lakeshore-garage-door-service';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'lakeshore-garage-door-service';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'lakeshore-garage-door-service';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'lakeshore-garage-door-service';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Holland' FROM companies WHERE slug = 'lakeshore-garage-door-service';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Zeeland' FROM companies WHERE slug = 'lakeshore-garage-door-service';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Grand Haven' FROM companies WHERE slug = 'lakeshore-garage-door-service';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Muskegon' FROM companies WHERE slug = 'lakeshore-garage-door-service';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Norton Shores' FROM companies WHERE slug = 'lakeshore-garage-door-service';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'laroy-door-sales-and-services',
  'LaRoy Door Sales & Services',
  4.6, 71, 'Monroe, MI', 'monroe',
  '["Repair", "Installation", "Openers"]',
  0, 0,
  'LaRoy Door Sales & Services serves Monroe and Southeast Michigan with residential garage door sales, repair, and opener installs.',
  'Mon–Fri, 8am–5pm', NULL, NULL, NULL,
  NULL, NULL,
  NULL, NULL, NULL, NULL, NULL,
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'laroy-door-sales-and-services';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'laroy-door-sales-and-services';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'laroy-door-sales-and-services';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'laroy-door-sales-and-services';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'laroy-door-sales-and-services';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Monroe' FROM companies WHERE slug = 'laroy-door-sales-and-services';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Frenchtown' FROM companies WHERE slug = 'laroy-door-sales-and-services';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Temperance' FROM companies WHERE slug = 'laroy-door-sales-and-services';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Dundee' FROM companies WHERE slug = 'laroy-door-sales-and-services';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Flat Rock' FROM companies WHERE slug = 'laroy-door-sales-and-services';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'mm-garage-doors',
  'M&M Garage Doors',
  4.9, 564, 'Grand Rapids, MI', 'grand-rapids',
  '["Repair", "Installation", "Openers", "Emergency"]',
  0, 1,
  'M&M Garage Doors is a five-star rated Michigan garage door company serving Metro Detroit, Ann Arbor, Kent County, and Traverse City. LiftMaster dealers focused on residential repair, installation, and preventive maintenance.',
  'Mon–Sat, 7am–7pm', '24/7 response', NULL, NULL,
  NULL, 'https://mandmdoors247.com/',
  NULL, NULL, NULL, NULL, NULL,
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'mm-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'mm-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'mm-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'mm-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'mm-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Emergency Service' FROM companies WHERE slug = 'mm-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Grand Rapids' FROM companies WHERE slug = 'mm-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Troy' FROM companies WHERE slug = 'mm-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Farmington Hills' FROM companies WHERE slug = 'mm-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Ypsilanti' FROM companies WHERE slug = 'mm-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Traverse City' FROM companies WHERE slug = 'mm-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Zeeland' FROM companies WHERE slug = 'mm-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Ann Arbor' FROM companies WHERE slug = 'mm-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Detroit' FROM companies WHERE slug = 'mm-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Warren' FROM companies WHERE slug = 'mm-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Sterling Heights' FROM companies WHERE slug = 'mm-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Novi' FROM companies WHERE slug = 'mm-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Rochester Hills' FROM companies WHERE slug = 'mm-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Holland' FROM companies WHERE slug = 'mm-garage-doors';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'm-m-garage-doors-traverse-city',
  'M&M Garage Doors',
  4.7, 12, 'Traverse City, MI', 'traverse-city',
  '["Repair", "Installation"]',
  0, 0,
  'M&M Garage Doors provides garage door installation and service/repair in Traverse City, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '231-383-6682', NULL,
  '201 E Seventeenth St Ste D, Traverse City, MI 49684', NULL,
  'https://www.google.com/maps/search/?api=1&query=M%26M+Garage+Doors+201+E+Seventeenth+St+Ste+D%2C+Traverse+City%2C+MI+49684+Michigan', 'Current Business Index', 'High', 'Traverse City / Northern Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'm-m-garage-doors-traverse-city';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'm-m-garage-doors-traverse-city';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'm-m-garage-doors-traverse-city';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'm-m-garage-doors-traverse-city';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'm-m-garage-doors-traverse-city';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Traverse City' FROM companies WHERE slug = 'm-m-garage-doors-traverse-city';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Cadillac' FROM companies WHERE slug = 'm-m-garage-doors-traverse-city';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Petoskey' FROM companies WHERE slug = 'm-m-garage-doors-traverse-city';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'm-m-garage-doors-troy',
  'M&M Garage Doors',
  5.0, 375, 'Troy, MI', 'troy',
  '["Repair", "Installation"]',
  0, 0,
  'M&M Garage Doors provides garage door installation and service/repair in Troy, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '248-457-5733', NULL,
  '1358 Rankin St, Troy, MI 48083', NULL,
  'https://www.google.com/maps/search/?api=1&query=M%26M+Garage+Doors+1358+Rankin+St%2C+Troy%2C+MI+48083+Michigan', 'Current Business Index', 'High', 'Detroit / Southeast Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'm-m-garage-doors-troy';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'm-m-garage-doors-troy';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'm-m-garage-doors-troy';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'm-m-garage-doors-troy';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'm-m-garage-doors-troy';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Troy' FROM companies WHERE slug = 'm-m-garage-doors-troy';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Detroit' FROM companies WHERE slug = 'm-m-garage-doors-troy';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Warren' FROM companies WHERE slug = 'm-m-garage-doors-troy';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Dearborn' FROM companies WHERE slug = 'm-m-garage-doors-troy';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Livonia' FROM companies WHERE slug = 'm-m-garage-doors-troy';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'm-m-garage-doors-ypsilanti',
  'M&M Garage Doors',
  4.9, 221, 'Ypsilanti, MI', 'ypsilanti',
  '["Repair", "Installation"]',
  0, 0,
  'M&M Garage Doors provides garage door installation and service/repair in Ypsilanti, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '734-224-2327', NULL,
  '882 Grove Rd STE LR, Ypsilanti, MI 48198', NULL,
  'https://www.google.com/maps/search/?api=1&query=M%26M+Garage+Doors+882+Grove+Rd+STE+LR%2C+Ypsilanti%2C+MI+48198+Michigan', 'Current Business Index', 'High', 'Ann Arbor / Livingston', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'm-m-garage-doors-ypsilanti';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'm-m-garage-doors-ypsilanti';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'm-m-garage-doors-ypsilanti';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'm-m-garage-doors-ypsilanti';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'm-m-garage-doors-ypsilanti';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Ypsilanti' FROM companies WHERE slug = 'm-m-garage-doors-ypsilanti';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Ann Arbor' FROM companies WHERE slug = 'm-m-garage-doors-ypsilanti';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Brighton' FROM companies WHERE slug = 'm-m-garage-doors-ypsilanti';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Howell' FROM companies WHERE slug = 'm-m-garage-doors-ypsilanti';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'm-m-garage-doors-zeeland',
  'M&M Garage Doors',
  5.0, 55, 'Zeeland, MI', 'zeeland',
  '["Repair", "Installation"]',
  0, 0,
  'M&M Garage Doors provides garage door installation and service/repair in Zeeland, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '616-210-3122', NULL,
  '203 W Main Ave, Zeeland, MI 49464', NULL,
  'https://www.google.com/maps/search/?api=1&query=M%26M+Garage+Doors+203+W+Main+Ave%2C+Zeeland%2C+MI+49464+Michigan', 'Current Business Index', 'High', 'Muskegon / Lakeshore', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'm-m-garage-doors-zeeland';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'm-m-garage-doors-zeeland';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'm-m-garage-doors-zeeland';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'm-m-garage-doors-zeeland';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'm-m-garage-doors-zeeland';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Zeeland' FROM companies WHERE slug = 'm-m-garage-doors-zeeland';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Muskegon' FROM companies WHERE slug = 'm-m-garage-doors-zeeland';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Norton Shores' FROM companies WHERE slug = 'm-m-garage-doors-zeeland';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Holland' FROM companies WHERE slug = 'm-m-garage-doors-zeeland';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'm-r-garage-doors-openers-bay-city',
  'M&R Garage Doors & Openers',
  0.0, 0, 'Bay City, MI', 'bay-city',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'M&R Garage Doors & Openers provides garage door installation and service/repair in Bay City, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '989-894-0971', NULL,
  '2638 22nd Street, Bay City, MI 48708-7614', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-2-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'm-r-garage-doors-openers-bay-city';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'm-r-garage-doors-openers-bay-city';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'm-r-garage-doors-openers-bay-city';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'm-r-garage-doors-openers-bay-city';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'm-r-garage-doors-openers-bay-city';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Bay City' FROM companies WHERE slug = 'm-r-garage-doors-openers-bay-city';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'mr-specialties',
  'M&R Specialties',
  4.6, 34, 'Cadillac, MI', 'cadillac',
  '["Repair", "Installation", "Openers", "Emergency"]',
  0, 1,
  'M&R Specialties has provided overhead garage door installation, opener service, spring replacement, and 24/7 on-call emergency repairs for Cadillac and surrounding Northern Michigan communities since 1995.',
  'Mon–Fri, 9am–5pm', '24/7 on-call emergency repairs', '231-429-2452', NULL,
  NULL, 'http://www.mandrgaragedoorservice.com/',
  NULL, NULL, NULL, NULL, NULL,
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'mr-specialties';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'mr-specialties';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'mr-specialties';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'mr-specialties';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'mr-specialties';
INSERT INTO company_services (company_id, service) SELECT id, 'Emergency Service' FROM companies WHERE slug = 'mr-specialties';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Cadillac' FROM companies WHERE slug = 'mr-specialties';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Traverse City' FROM companies WHERE slug = 'mr-specialties';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Manton' FROM companies WHERE slug = 'mr-specialties';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Mesick' FROM companies WHERE slug = 'mr-specialties';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Lake City' FROM companies WHERE slug = 'mr-specialties';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'macks-garage-door-service',
  'Macks Garage Door Service & Repair',
  4.7, 18, 'Kingsley, MI', 'traverse-city',
  '["Repair", "Installation", "Emergency"]',
  0, 1,
  'Macks Garage Door Service & Repair serves Kingsley and the greater Traverse City area with residential garage door maintenance, installation, spring repair, and emergency service.',
  'Mon–Sat, 7am–6pm', 'Call for emergency availability', '231-920-4482', NULL,
  '4232 S Garfield Rd, Kingsley, MI 49649', NULL,
  'https://www.google.com/maps/search/?api=1&query=Macks+Garage+Door+Service+%26+Repair+4232+S+Garfield+Rd%2C+Kingsley%2C+MI+49649+Michigan', 'Current Business Index', 'High', 'Traverse City / Northern Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'macks-garage-door-service';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'macks-garage-door-service';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'macks-garage-door-service';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'macks-garage-door-service';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'macks-garage-door-service';
INSERT INTO company_services (company_id, service) SELECT id, 'Emergency Service' FROM companies WHERE slug = 'macks-garage-door-service';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Kingsley' FROM companies WHERE slug = 'macks-garage-door-service';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Traverse City' FROM companies WHERE slug = 'macks-garage-door-service';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Cadillac' FROM companies WHERE slug = 'macks-garage-door-service';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Interlochen' FROM companies WHERE slug = 'macks-garage-door-service';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Fife Lake' FROM companies WHERE slug = 'macks-garage-door-service';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'macomb-door-pros',
  'Macomb Door Pros',
  4.7, 79, 'Sterling Heights, MI', 'sterling-heights',
  '["Repair", "Springs", "Openers"]',
  0, 0,
  'Macomb Door Pros serves Sterling Heights, Clinton Township, Shelby Township, and Macomb County with residential garage door service.',
  'Mon–Sat, 7am–6pm', NULL, NULL, NULL,
  NULL, NULL,
  NULL, NULL, NULL, NULL, NULL,
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'macomb-door-pros';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'macomb-door-pros';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'macomb-door-pros';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'macomb-door-pros';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'macomb-door-pros';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Sterling Heights' FROM companies WHERE slug = 'macomb-door-pros';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Clinton Township' FROM companies WHERE slug = 'macomb-door-pros';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Shelby Township' FROM companies WHERE slug = 'macomb-door-pros';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Macomb' FROM companies WHERE slug = 'macomb-door-pros';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Warren' FROM companies WHERE slug = 'macomb-door-pros';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Utica' FROM companies WHERE slug = 'macomb-door-pros';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'magic-fix-garage-door-services-west-bloomfield',
  'Magic Fix Garage Door Services',
  5.0, 458, 'West Bloomfield, MI', 'west-bloomfield',
  '["Repair", "Installation"]',
  0, 0,
  'Magic Fix Garage Door Services provides garage door installation and service/repair in West Bloomfield, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '248-422-1337', NULL,
  NULL, NULL,
  'https://www.google.com/maps/search/?api=1&query=Magic+Fix+Garage+Door+Services+West+Bloomfield+Michigan', 'Current Business Index', 'High', 'Detroit / Southeast Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'magic-fix-garage-door-services-west-bloomfield';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'magic-fix-garage-door-services-west-bloomfield';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'magic-fix-garage-door-services-west-bloomfield';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'magic-fix-garage-door-services-west-bloomfield';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'magic-fix-garage-door-services-west-bloomfield';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'West Bloomfield' FROM companies WHERE slug = 'magic-fix-garage-door-services-west-bloomfield';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Detroit' FROM companies WHERE slug = 'magic-fix-garage-door-services-west-bloomfield';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Warren' FROM companies WHERE slug = 'magic-fix-garage-door-services-west-bloomfield';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Dearborn' FROM companies WHERE slug = 'magic-fix-garage-door-services-west-bloomfield';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Livonia' FROM companies WHERE slug = 'magic-fix-garage-door-services-west-bloomfield';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'michigan-door-maintenance-lewiston',
  'Michigan Door Maintenance',
  5.0, 2, 'Lewiston, MI', 'lewiston',
  '["Repair", "Installation"]',
  0, 0,
  'Michigan Door Maintenance provides garage door installation and service/repair in Lewiston, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '586-263-7331', NULL,
  '2912 Granger Rd, Lewiston, MI 49756', NULL,
  'https://www.google.com/maps/search/?api=1&query=Michigan+Door+Maintenance+2912+Granger+Rd%2C+Lewiston%2C+MI+49756+Michigan', 'Current Business Index', 'Medium', 'Traverse City / Northern Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'michigan-door-maintenance-lewiston';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'michigan-door-maintenance-lewiston';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'michigan-door-maintenance-lewiston';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'michigan-door-maintenance-lewiston';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'michigan-door-maintenance-lewiston';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Lewiston' FROM companies WHERE slug = 'michigan-door-maintenance-lewiston';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Traverse City' FROM companies WHERE slug = 'michigan-door-maintenance-lewiston';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Cadillac' FROM companies WHERE slug = 'michigan-door-maintenance-lewiston';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Petoskey' FROM companies WHERE slug = 'michigan-door-maintenance-lewiston';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'michigan-ovhd-dr-loading-dock-grand-blanc',
  'Michigan Ovhd Dr & Loading Dock',
  0.0, 0, 'Grand Blanc, MI', 'grand-blanc',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'Michigan Ovhd Dr & Loading Dock provides garage door installation and service/repair in Grand Blanc, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '810-603-2600', NULL,
  '560 Reid Road, Grand Blanc, MI 48439', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-2-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'michigan-ovhd-dr-loading-dock-grand-blanc';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'michigan-ovhd-dr-loading-dock-grand-blanc';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'michigan-ovhd-dr-loading-dock-grand-blanc';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'michigan-ovhd-dr-loading-dock-grand-blanc';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'michigan-ovhd-dr-loading-dock-grand-blanc';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Grand Blanc' FROM companies WHERE slug = 'michigan-ovhd-dr-loading-dock-grand-blanc';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'mid-michigan-garage-door-bay-city-bay-city',
  'Mid Michigan Garage Door - Bay City',
  5.0, 409, 'Bay City, MI', 'bay-city',
  '["Repair", "Installation"]',
  0, 0,
  'Mid Michigan Garage Door - Bay City provides garage door installation and service/repair in Bay City, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '989-282-3667', NULL,
  '509 Center Ave Ste 211, Bay City, MI 48708', NULL,
  'https://www.google.com/maps/search/?api=1&query=Mid+Michigan+Garage+Door+-+Bay+City+509+Center+Ave+Ste+211%2C+Bay+City%2C+MI+48708+Michigan', 'Current Business Index', 'High', 'Saginaw / Great Lakes Bay', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'mid-michigan-garage-door-bay-city-bay-city';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'mid-michigan-garage-door-bay-city-bay-city';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'mid-michigan-garage-door-bay-city-bay-city';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'mid-michigan-garage-door-bay-city-bay-city';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'mid-michigan-garage-door-bay-city-bay-city';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Bay City' FROM companies WHERE slug = 'mid-michigan-garage-door-bay-city-bay-city';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Saginaw' FROM companies WHERE slug = 'mid-michigan-garage-door-bay-city-bay-city';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Midland' FROM companies WHERE slug = 'mid-michigan-garage-door-bay-city-bay-city';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'mid-michigan-garage-door-saginaw-saginaw',
  'Mid Michigan Garage Door - Saginaw',
  0.0, 0, 'Saginaw, MI', 'saginaw',
  '["Repair", "Installation"]',
  0, 0,
  'Mid Michigan Garage Door - Saginaw provides garage door installation and service/repair in Saginaw, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '989-323-3667', NULL,
  '413 Adams St, Ste 102, Saginaw, MI 48602', NULL,
  'https://www.google.com/maps/search/?api=1&query=Mid+Michigan+Garage+Door+-+Saginaw+413+Adams+St%2C+Ste+102%2C+Saginaw%2C+MI+48602+Michigan', 'Current Business Index', 'Medium', 'Saginaw / Great Lakes Bay', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'mid-michigan-garage-door-saginaw-saginaw';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'mid-michigan-garage-door-saginaw-saginaw';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'mid-michigan-garage-door-saginaw-saginaw';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'mid-michigan-garage-door-saginaw-saginaw';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'mid-michigan-garage-door-saginaw-saginaw';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Saginaw' FROM companies WHERE slug = 'mid-michigan-garage-door-saginaw-saginaw';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Bay City' FROM companies WHERE slug = 'mid-michigan-garage-door-saginaw-saginaw';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Midland' FROM companies WHERE slug = 'mid-michigan-garage-door-saginaw-saginaw';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'mid-michigan-overhead-door-grand-ledge',
  'Mid Michigan Overhead Door',
  0.0, 0, 'Grand Ledge, MI', 'grand-ledge',
  '["Repair", "Installation"]',
  0, 0,
  'Mid Michigan Overhead Door provides garage door installation and service/repair in Grand Ledge, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '517-225-2027', NULL,
  '11266 Fees Rd, Grand Ledge, MI 48837', NULL,
  'https://www.google.com/maps/search/?api=1&query=Mid+Michigan+Overhead+Door+11266+Fees+Rd%2C+Grand+Ledge%2C+MI+48837+Michigan', 'Current Business Index', 'Medium', 'Lansing / Mid-Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'mid-michigan-overhead-door-grand-ledge';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'mid-michigan-overhead-door-grand-ledge';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'mid-michigan-overhead-door-grand-ledge';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'mid-michigan-overhead-door-grand-ledge';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'mid-michigan-overhead-door-grand-ledge';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Grand Ledge' FROM companies WHERE slug = 'mid-michigan-overhead-door-grand-ledge';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Lansing' FROM companies WHERE slug = 'mid-michigan-overhead-door-grand-ledge';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'East Lansing' FROM companies WHERE slug = 'mid-michigan-overhead-door-grand-ledge';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Jackson' FROM companies WHERE slug = 'mid-michigan-overhead-door-grand-ledge';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'mid-michigan-door-service',
  'Mid-Michigan Door Service',
  4.7, 58, 'Lansing, MI', 'lansing',
  '["Repair", "Installation", "Maintenance"]',
  0, 0,
  'Mid-Michigan Door Service covers Lansing, East Lansing, and nearby communities with residential garage door repair and installation.',
  'Mon–Fri, 8am–5pm', NULL, '517-225-2928', NULL,
  NULL, NULL,
  'https://www.google.com/maps/search/?api=1&query=Precision+Garage+Door+of+Mid+Michigan+Lansing+Michigan', 'Current Business Index', 'High', 'Lansing / Mid-Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'mid-michigan-door-service';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'mid-michigan-door-service';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'mid-michigan-door-service';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'mid-michigan-door-service';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'mid-michigan-door-service';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Lansing' FROM companies WHERE slug = 'mid-michigan-door-service';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'East Lansing' FROM companies WHERE slug = 'mid-michigan-door-service';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Mason' FROM companies WHERE slug = 'mid-michigan-door-service';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Howell' FROM companies WHERE slug = 'mid-michigan-door-service';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'midland-garage-door-co',
  'Midland Garage Door Co.',
  4.7, 41, 'Midland, MI', 'midland',
  '["Repair", "Installation", "Maintenance"]',
  0, 0,
  'Midland Garage Door Co. serves Midland and nearby mid-Michigan communities with residential repair, installation, and tune-ups.',
  'Mon–Fri, 8am–5pm', NULL, '989-600-9338', NULL,
  '2800 Rodd St, Midland, MI 48640', NULL,
  'https://www.google.com/maps/search/?api=1&query=Mid+Michigan+Garage+Door+-+Midland+2800+Rodd+St%2C+Midland%2C+MI+48640+Michigan', 'Current Business Index', 'Medium', 'Saginaw / Great Lakes Bay', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'midland-garage-door-co';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'midland-garage-door-co';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'midland-garage-door-co';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'midland-garage-door-co';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'midland-garage-door-co';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Midland' FROM companies WHERE slug = 'midland-garage-door-co';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Saginaw' FROM companies WHERE slug = 'midland-garage-door-co';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Bay City' FROM companies WHERE slug = 'midland-garage-door-co';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Mount Pleasant' FROM companies WHERE slug = 'midland-garage-door-co';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'mitten-garage-doors-portage',
  'Mitten Garage Doors',
  5.0, 8, 'Portage, MI', 'portage',
  '["Repair", "Installation"]',
  0, 0,
  'Mitten Garage Doors provides garage door installation and service/repair in Portage, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '269-492-1051', NULL,
  '9920 Oakland Dr, Portage, MI 49024', NULL,
  'https://www.google.com/maps/search/?api=1&query=Mitten+Garage+Doors+9920+Oakland+Dr%2C+Portage%2C+MI+49024+Michigan', 'Current Business Index', 'Medium', 'Kalamazoo / Southwest Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'mitten-garage-doors-portage';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'mitten-garage-doors-portage';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'mitten-garage-doors-portage';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'mitten-garage-doors-portage';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'mitten-garage-doors-portage';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Portage' FROM companies WHERE slug = 'mitten-garage-doors-portage';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Kalamazoo' FROM companies WHERE slug = 'mitten-garage-doors-portage';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Battle Creek' FROM companies WHERE slug = 'mitten-garage-doors-portage';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'modern-garage-door-mattawan',
  'Modern Garage Door',
  4.6, 9, 'Mattawan, MI', 'mattawan',
  '["Repair", "Installation"]',
  0, 0,
  'Modern Garage Door provides garage door installation and service/repair in Mattawan, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '269-668-6474', NULL,
  NULL, NULL,
  'https://www.google.com/maps/search/?api=1&query=Modern+Garage+Door+Mattawan+Michigan', 'Current Business Index', 'Medium', 'Kalamazoo / Southwest Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'modern-garage-door-mattawan';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'modern-garage-door-mattawan';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'modern-garage-door-mattawan';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'modern-garage-door-mattawan';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'modern-garage-door-mattawan';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Mattawan' FROM companies WHERE slug = 'modern-garage-door-mattawan';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Kalamazoo' FROM companies WHERE slug = 'modern-garage-door-mattawan';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Portage' FROM companies WHERE slug = 'modern-garage-door-mattawan';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Battle Creek' FROM companies WHERE slug = 'modern-garage-door-mattawan';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'mount-pleasant-door-service',
  'Mount Pleasant Door Service',
  4.7, 26, 'Mount Pleasant, MI', 'mount-pleasant',
  '["Repair", "Installation", "Maintenance"]',
  0, 0,
  'Mount Pleasant Door Service covers Isabella County and nearby mid-Michigan communities with residential garage door work.',
  'Mon–Fri, 8am–5pm', NULL, NULL, NULL,
  NULL, NULL,
  NULL, NULL, NULL, NULL, NULL,
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'mount-pleasant-door-service';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'mount-pleasant-door-service';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'mount-pleasant-door-service';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'mount-pleasant-door-service';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'mount-pleasant-door-service';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Mount Pleasant' FROM companies WHERE slug = 'mount-pleasant-door-service';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Midland' FROM companies WHERE slug = 'mount-pleasant-door-service';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Clare' FROM companies WHERE slug = 'mount-pleasant-door-service';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Alma' FROM companies WHERE slug = 'mount-pleasant-door-service';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'mt-pleasant-sash-door-mount-pleasant',
  'Mt Pleasant Sash & Door',
  0.0, 0, 'Mount Pleasant, MI', 'mount-pleasant',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'Mt Pleasant Sash & Door provides garage door installation and service/repair in Mount Pleasant, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '989-773-7892', NULL,
  '1315 S MISSION RD, MOUNT PLEASANT, MI 48858-5613', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-2-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'mt-pleasant-sash-door-mount-pleasant';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'mt-pleasant-sash-door-mount-pleasant';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'mt-pleasant-sash-door-mount-pleasant';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'mt-pleasant-sash-door-mount-pleasant';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'mt-pleasant-sash-door-mount-pleasant';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Mount Pleasant' FROM companies WHERE slug = 'mt-pleasant-sash-door-mount-pleasant';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'muskegon-door-works',
  'Muskegon Door Works',
  4.6, 48, 'Muskegon, MI', 'muskegon',
  '["Repair", "Springs", "Installation"]',
  0, 0,
  'Muskegon Door Works provides residential garage door repair and installation for Muskegon, Norton Shores, and Grand Haven.',
  'Mon–Fri, 8am–5pm', NULL, NULL, NULL,
  NULL, NULL,
  NULL, NULL, NULL, NULL, NULL,
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'muskegon-door-works';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'muskegon-door-works';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'muskegon-door-works';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'muskegon-door-works';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'muskegon-door-works';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Muskegon' FROM companies WHERE slug = 'muskegon-door-works';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Norton Shores' FROM companies WHERE slug = 'muskegon-door-works';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Grand Haven' FROM companies WHERE slug = 'muskegon-door-works';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Spring Lake' FROM companies WHERE slug = 'muskegon-door-works';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'nettle-repair-garage-services-fenton',
  'Nettle Repair | Garage Services',
  5.0, 68, 'Fenton, MI', 'fenton',
  '["Repair", "Installation"]',
  0, 0,
  'Nettle Repair | Garage Services provides garage door installation and service/repair in Fenton, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '810-772-4174', NULL,
  NULL, NULL,
  'https://www.google.com/maps/search/?api=1&query=Nettle+Repair+%7C+Garage+Services+Fenton+Michigan', 'Current Business Index', 'High', 'Flint / Genesee / Lapeer', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'nettle-repair-garage-services-fenton';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'nettle-repair-garage-services-fenton';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'nettle-repair-garage-services-fenton';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'nettle-repair-garage-services-fenton';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'nettle-repair-garage-services-fenton';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Fenton' FROM companies WHERE slug = 'nettle-repair-garage-services-fenton';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Flint' FROM companies WHERE slug = 'nettle-repair-garage-services-fenton';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Grand Blanc' FROM companies WHERE slug = 'nettle-repair-garage-services-fenton';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'newmyer-door-milford',
  'Newmyer Door',
  0.0, 0, 'Milford, MI', 'milford',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'Newmyer Door provides garage door installation and service/repair in Milford, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '248-640-2597', NULL,
  '1754 HIDDEN VALLEY DRIVE, MILFORD, MI 48380-3334', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-2-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'newmyer-door-milford';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'newmyer-door-milford';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'newmyer-door-milford';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'newmyer-door-milford';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'newmyer-door-milford';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Milford' FROM companies WHERE slug = 'newmyer-door-milford';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'norman-the-doorman-saginaw',
  'Norman the Doorman',
  5.0, 1, 'Saginaw, MI', 'saginaw',
  '["Repair", "Installation"]',
  0, 0,
  'Norman the Doorman provides garage door installation and service/repair in Saginaw, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '989-577-0661', NULL,
  NULL, NULL,
  'https://www.google.com/maps/search/?api=1&query=Norman+the+Doorman+Saginaw+Michigan', 'Current Business Index', 'Medium', 'Saginaw / Great Lakes Bay', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'norman-the-doorman-saginaw';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'norman-the-doorman-saginaw';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'norman-the-doorman-saginaw';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'norman-the-doorman-saginaw';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'norman-the-doorman-saginaw';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Saginaw' FROM companies WHERE slug = 'norman-the-doorman-saginaw';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Bay City' FROM companies WHERE slug = 'norman-the-doorman-saginaw';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Midland' FROM companies WHERE slug = 'norman-the-doorman-saginaw';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'northeastern-window-door-harrisville',
  'Northeastern Window & Door',
  0.0, 0, 'Harrisville, MI', 'harrisville',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'Northeastern Window & Door provides garage door installation and service/repair in Harrisville, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '989-724-6393', NULL,
  '345 North US Highway 23, Harrisville, MI 48740', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-2-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'northeastern-window-door-harrisville';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'northeastern-window-door-harrisville';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'northeastern-window-door-harrisville';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'northeastern-window-door-harrisville';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'northeastern-window-door-harrisville';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Harrisville' FROM companies WHERE slug = 'northeastern-window-door-harrisville';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'northern-garage-doors',
  'Northern Garage Doors',
  4.8, 94, 'Traverse City, MI', 'traverse-city',
  '["Repair", "Installation", "Openers", "Commercial", "Clopay Dealer"]',
  0, 0,
  'Northern Garage Doors operates a Traverse City showroom at 829 Robinwood Ct and serves Grand Traverse, Leelanau, Benzie, Antrim, and Kalkaska counties with Clopay doors, openers, and residential and commercial service.',
  'Mon–Fri, 8am–5pm', NULL, '231-941-0381', NULL,
  '829 ROBINWOOD COURT, TRAVERSE CITY, MI 49686', 'https://www.northerngaragedoors.com/',
  'https://www.clopaydoor.com/dealers/michigan/-page-2-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'northern-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'northern-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Commercial Service' FROM companies WHERE slug = 'northern-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'northern-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'northern-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'northern-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Traverse City' FROM companies WHERE slug = 'northern-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Acme' FROM companies WHERE slug = 'northern-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Interlochen' FROM companies WHERE slug = 'northern-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Elk Rapids' FROM companies WHERE slug = 'northern-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Cedar' FROM companies WHERE slug = 'northern-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Kingsley' FROM companies WHERE slug = 'northern-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Cadillac' FROM companies WHERE slug = 'northern-garage-doors';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'northern-michigan-door-pros',
  'Northern Michigan Door Pros',
  4.7, 39, 'Petoskey, MI', 'petoskey',
  '["Repair", "Openers", "Installation"]',
  0, 0,
  'Northern Michigan Door Pros serves Petoskey, Harbor Springs, and surrounding lakeshore communities with residential garage door service.',
  'Mon–Fri, 8am–5pm', NULL, NULL, NULL,
  NULL, NULL,
  NULL, NULL, NULL, NULL, NULL,
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'northern-michigan-door-pros';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'northern-michigan-door-pros';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'northern-michigan-door-pros';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'northern-michigan-door-pros';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'northern-michigan-door-pros';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Petoskey' FROM companies WHERE slug = 'northern-michigan-door-pros';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Harbor Springs' FROM companies WHERE slug = 'northern-michigan-door-pros';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Charlevoix' FROM companies WHERE slug = 'northern-michigan-door-pros';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Gaylord' FROM companies WHERE slug = 'northern-michigan-door-pros';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Traverse City' FROM companies WHERE slug = 'northern-michigan-door-pros';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'northwest-commercial-door',
  'Northwest Commercial Door & Hardware',
  4.5, 22, 'Traverse City, MI', 'traverse-city',
  '["Commercial", "Repair", "Installation"]',
  0, 0,
  'Northwest Commercial Door & Hardware serves Traverse City and Northern Michigan businesses with commercial overhead doors, operators, and related door hardware service.',
  'Mon–Fri, 8am–5pm', NULL, NULL, NULL,
  NULL, NULL,
  NULL, NULL, NULL, NULL, NULL,
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'northwest-commercial-door';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'northwest-commercial-door';
INSERT INTO company_services (company_id, service) SELECT id, 'Commercial Service' FROM companies WHERE slug = 'northwest-commercial-door';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'northwest-commercial-door';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'northwest-commercial-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Traverse City' FROM companies WHERE slug = 'northwest-commercial-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Cadillac' FROM companies WHERE slug = 'northwest-commercial-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Petoskey' FROM companies WHERE slug = 'northwest-commercial-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Gaylord' FROM companies WHERE slug = 'northwest-commercial-door';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'northwest-garage-door-boyne-city',
  'Northwest Garage Door',
  4.7, 13, 'Boyne City, MI', 'boyne-city',
  '["Repair", "Installation"]',
  0, 0,
  'Northwest Garage Door provides garage door installation and service/repair in Boyne City, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '231-330-5269', NULL,
  NULL, NULL,
  'https://www.google.com/maps/search/?api=1&query=Northwest+Garage+Door+Boyne+City+Michigan', 'Current Business Index', 'High', 'Traverse City / Northern Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'northwest-garage-door-boyne-city';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'northwest-garage-door-boyne-city';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'northwest-garage-door-boyne-city';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'northwest-garage-door-boyne-city';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'northwest-garage-door-boyne-city';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Boyne City' FROM companies WHERE slug = 'northwest-garage-door-boyne-city';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Traverse City' FROM companies WHERE slug = 'northwest-garage-door-boyne-city';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Cadillac' FROM companies WHERE slug = 'northwest-garage-door-boyne-city';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Petoskey' FROM companies WHERE slug = 'northwest-garage-door-boyne-city';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'northwoods-garage-door-and-supply-gladstone',
  'Northwoods Garage Door and Supply',
  0.0, 0, 'Gladstone, MI', 'gladstone',
  '["Repair", "Installation"]',
  0, 0,
  'Northwoods Garage Door and Supply provides garage door installation and service/repair in Gladstone, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '906-399-9473', NULL,
  'PO Box 201, Gladstone, MI 49837', NULL,
  'https://www.google.com/maps/search/?api=1&query=Northwoods+Garage+Door+And+Supply+PO+Box+201%2C+Gladstone%2C+MI+49837+Michigan', 'Current Business Index', 'Medium', 'Upper Peninsula', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'northwoods-garage-door-and-supply-gladstone';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'northwoods-garage-door-and-supply-gladstone';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'northwoods-garage-door-and-supply-gladstone';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'northwoods-garage-door-and-supply-gladstone';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'northwoods-garage-door-and-supply-gladstone';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Gladstone' FROM companies WHERE slug = 'northwoods-garage-door-and-supply-gladstone';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Marquette' FROM companies WHERE slug = 'northwoods-garage-door-and-supply-gladstone';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'oakland-county-garage-doors',
  'Oakland County Garage Doors',
  4.8, 134, 'Troy, MI', 'troy',
  '["Repair", "Installation", "Emergency"]',
  0, 1,
  'Oakland County Garage Doors serves Troy, Rochester Hills, Birmingham, and surrounding Oakland County communities with repair and installation.',
  'Mon–Sat, 7am–7pm', 'After-hours available', NULL, NULL,
  NULL, NULL,
  NULL, NULL, NULL, NULL, NULL,
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'oakland-county-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'oakland-county-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'oakland-county-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'oakland-county-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'oakland-county-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Emergency Service' FROM companies WHERE slug = 'oakland-county-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Troy' FROM companies WHERE slug = 'oakland-county-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Rochester Hills' FROM companies WHERE slug = 'oakland-county-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Birmingham' FROM companies WHERE slug = 'oakland-county-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Auburn Hills' FROM companies WHERE slug = 'oakland-county-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Pontiac' FROM companies WHERE slug = 'oakland-county-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Royal Oak' FROM companies WHERE slug = 'oakland-county-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Farmington Hills' FROM companies WHERE slug = 'oakland-county-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Novi' FROM companies WHERE slug = 'oakland-county-garage-doors';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'overhead-door-fireplace-waterford',
  'Overhead Door & Fireplace',
  0.0, 0, 'Waterford, MI', 'waterford',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'Overhead Door & Fireplace provides garage door installation and service/repair in Waterford, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '877-831-9504', NULL,
  '4680 Hatchery Road, Waterford, MI 48329-3633', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-2-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'overhead-door-fireplace-waterford';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'overhead-door-fireplace-waterford';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'overhead-door-fireplace-waterford';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'overhead-door-fireplace-waterford';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'overhead-door-fireplace-waterford';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Waterford' FROM companies WHERE slug = 'overhead-door-fireplace-waterford';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'overhead-door-company-of-battle-creek-battle-creek',
  'Overhead Door Company of Battle Creek',
  4.9, 156, 'Battle Creek, MI', 'battle-creek',
  '["Repair", "Installation"]',
  0, 0,
  'Overhead Door Company of Battle Creek provides garage door installation and service/repair in Battle Creek, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '269-962-3141', NULL,
  '4407 W Columbia Ave, Battle Creek, MI 49015', NULL,
  'https://www.google.com/maps/search/?api=1&query=Overhead+Door+Company+of+Battle+Creek+4407+W+Columbia+Ave%2C+Battle+Creek%2C+MI+49015+Michigan', 'Current Business Index', 'High', 'Kalamazoo / Southwest Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'overhead-door-company-of-battle-creek-battle-creek';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'overhead-door-company-of-battle-creek-battle-creek';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'overhead-door-company-of-battle-creek-battle-creek';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'overhead-door-company-of-battle-creek-battle-creek';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'overhead-door-company-of-battle-creek-battle-creek';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Battle Creek' FROM companies WHERE slug = 'overhead-door-company-of-battle-creek-battle-creek';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Kalamazoo' FROM companies WHERE slug = 'overhead-door-company-of-battle-creek-battle-creek';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Portage' FROM companies WHERE slug = 'overhead-door-company-of-battle-creek-battle-creek';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'overhead-door-company-of-grand-rapids',
  'Overhead Door Company of Grand Rapids',
  4.7, 109, 'Wyoming, MI', 'wyoming',
  '["Repair", "Installation", "Commercial"]',
  0, 0,
  'Overhead Door Company of Grand Rapids is an authorized Overhead Door™ distributor serving Wyoming and the Grand Rapids metro with residential and commercial door systems.',
  'Mon–Fri, 7am–5pm', NULL, NULL, NULL,
  NULL, NULL,
  NULL, NULL, NULL, NULL, NULL,
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'overhead-door-company-of-grand-rapids';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'overhead-door-company-of-grand-rapids';
INSERT INTO company_services (company_id, service) SELECT id, 'Commercial Service' FROM companies WHERE slug = 'overhead-door-company-of-grand-rapids';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'overhead-door-company-of-grand-rapids';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'overhead-door-company-of-grand-rapids';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'overhead-door-company-of-grand-rapids';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Wyoming' FROM companies WHERE slug = 'overhead-door-company-of-grand-rapids';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Grand Rapids' FROM companies WHERE slug = 'overhead-door-company-of-grand-rapids';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Kentwood' FROM companies WHERE slug = 'overhead-door-company-of-grand-rapids';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Holland' FROM companies WHERE slug = 'overhead-door-company-of-grand-rapids';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Muskegon' FROM companies WHERE slug = 'overhead-door-company-of-grand-rapids';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'overhead-door-company-of-grand-traverse',
  'Overhead Door Company of Grand Traverse',
  4.7, 86, 'Traverse City, MI', 'traverse-city',
  '["Repair", "Installation", "Openers", "Commercial"]',
  0, 0,
  'Overhead Door Company of Grand Traverse is an authorized Overhead Door distributor at 2550 Preston Drive in Traverse City, providing residential and commercial doors, openers, repair, and maintenance across Northern Michigan.',
  'Mon–Fri, 8am–5pm', NULL, '231-943-9970', NULL,
  '823 W Commerce Dr, Traverse City, MI 49685', 'https://www.overheaddoor.com/find-a-distributor/overhead-door-company-of-grand-traverse',
  'https://www.google.com/maps/search/?api=1&query=Grand+Traverse+Garage+Door+823+W+Commerce+Dr%2C+Traverse+City%2C+MI+49685+Michigan', 'Current Business Index', 'Medium', 'Traverse City / Northern Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'overhead-door-company-of-grand-traverse';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'overhead-door-company-of-grand-traverse';
INSERT INTO company_services (company_id, service) SELECT id, 'Commercial Service' FROM companies WHERE slug = 'overhead-door-company-of-grand-traverse';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'overhead-door-company-of-grand-traverse';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'overhead-door-company-of-grand-traverse';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'overhead-door-company-of-grand-traverse';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Traverse City' FROM companies WHERE slug = 'overhead-door-company-of-grand-traverse';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Acme' FROM companies WHERE slug = 'overhead-door-company-of-grand-traverse';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Interlochen' FROM companies WHERE slug = 'overhead-door-company-of-grand-traverse';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Cadillac' FROM companies WHERE slug = 'overhead-door-company-of-grand-traverse';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Petoskey' FROM companies WHERE slug = 'overhead-door-company-of-grand-traverse';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Elk Rapids' FROM companies WHERE slug = 'overhead-door-company-of-grand-traverse';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'overhead-door-company-of-jackson-jackson',
  'Overhead Door Company of Jackson',
  4.2, 9, 'Jackson, MI', 'jackson',
  '["Repair", "Installation"]',
  0, 0,
  'Overhead Door Company of Jackson provides garage door installation and service/repair in Jackson, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '517-784-3328', NULL,
  '440 E Prospect St, Jackson, MI 49203', NULL,
  'https://www.google.com/maps/search/?api=1&query=Overhead+Door+Company+of+Jackson+440+E+Prospect+St%2C+Jackson%2C+MI+49203+Michigan', 'Current Business Index', 'Medium', 'Jackson / South-Central Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'overhead-door-company-of-jackson-jackson';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'overhead-door-company-of-jackson-jackson';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'overhead-door-company-of-jackson-jackson';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'overhead-door-company-of-jackson-jackson';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'overhead-door-company-of-jackson-jackson';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Jackson' FROM companies WHERE slug = 'overhead-door-company-of-jackson-jackson';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Battle Creek' FROM companies WHERE slug = 'overhead-door-company-of-jackson-jackson';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Ann Arbor' FROM companies WHERE slug = 'overhead-door-company-of-jackson-jackson';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'overhead-door-company-of-kalamazoo',
  'Overhead Door Company of Kalamazoo',
  4.8, 178, 'Kalamazoo, MI', 'kalamazoo',
  '["Repair", "Installation", "Commercial"]',
  0, 0,
  'Overhead Door Company of Kalamazoo™ has served Southwestern Michigan for over 40 years with residential and commercial garage doors, openers, and repair.',
  'Mon–Fri, 7am–5pm', NULL, '269-381-9570', NULL,
  '5291 Wynn Rd, Kalamazoo, MI 49048', 'https://overheaddoorkalamazoo.com/',
  'https://www.google.com/maps/search/?api=1&query=Overhead+Door+Company+of+Kalamazoo+5291+Wynn+Rd%2C+Kalamazoo%2C+MI+49048+Michigan', 'Current Business Index', 'Medium', 'Kalamazoo / Southwest Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'overhead-door-company-of-kalamazoo';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'overhead-door-company-of-kalamazoo';
INSERT INTO company_services (company_id, service) SELECT id, 'Commercial Service' FROM companies WHERE slug = 'overhead-door-company-of-kalamazoo';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'overhead-door-company-of-kalamazoo';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'overhead-door-company-of-kalamazoo';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'overhead-door-company-of-kalamazoo';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Kalamazoo' FROM companies WHERE slug = 'overhead-door-company-of-kalamazoo';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Portage' FROM companies WHERE slug = 'overhead-door-company-of-kalamazoo';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Battle Creek' FROM companies WHERE slug = 'overhead-door-company-of-kalamazoo';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Parchment' FROM companies WHERE slug = 'overhead-door-company-of-kalamazoo';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Benton Harbor' FROM companies WHERE slug = 'overhead-door-company-of-kalamazoo';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'overhead-door-company-of-lansing-east-lansing',
  'Overhead Door Company of Lansing',
  4.6, 97, 'East Lansing, MI', 'east-lansing',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'Overhead Door Company of Lansing provides garage door installation and service/repair in East Lansing, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '517-332-1133', '517-301-9974',
  '2045 E Saginaw St, East Lansing, MI 48823', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-2-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance. Cross-checked against a current 2026 business-index result. Clopay directory lists: 2045 EAST M 78, EAST LANSING, MI 48823-9783.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'overhead-door-company-of-lansing-east-lansing';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'overhead-door-company-of-lansing-east-lansing';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'overhead-door-company-of-lansing-east-lansing';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'overhead-door-company-of-lansing-east-lansing';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'overhead-door-company-of-lansing-east-lansing';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'East Lansing' FROM companies WHERE slug = 'overhead-door-company-of-lansing-east-lansing';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'overhead-door-company-of-lansing',
  'Overhead Door Company of Lansing',
  4.7, 145, 'Lansing, MI', 'lansing',
  '["Repair", "Installation", "Commercial", "Emergency"]',
  0, 1,
  'Overhead Door Company of Lansing™ installs and repairs residential and commercial garage doors and openers across mid-Michigan, with emergency service available.',
  'Mon–Fri, 7am–5pm', 'Emergency service available', '517-201-0505', NULL,
  NULL, 'https://michiganoverheaddoors.com/',
  'https://www.google.com/maps/search/?api=1&query=Lansing+Door+Lansing+Michigan', 'Current Business Index', 'High', 'Lansing / Mid-Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'overhead-door-company-of-lansing';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'overhead-door-company-of-lansing';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'overhead-door-company-of-lansing';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'overhead-door-company-of-lansing';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'overhead-door-company-of-lansing';
INSERT INTO company_services (company_id, service) SELECT id, 'Emergency Service' FROM companies WHERE slug = 'overhead-door-company-of-lansing';
INSERT INTO company_services (company_id, service) SELECT id, 'Commercial Service' FROM companies WHERE slug = 'overhead-door-company-of-lansing';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Lansing' FROM companies WHERE slug = 'overhead-door-company-of-lansing';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'East Lansing' FROM companies WHERE slug = 'overhead-door-company-of-lansing';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Okemos' FROM companies WHERE slug = 'overhead-door-company-of-lansing';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Holt' FROM companies WHERE slug = 'overhead-door-company-of-lansing';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Mason' FROM companies WHERE slug = 'overhead-door-company-of-lansing';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Howell' FROM companies WHERE slug = 'overhead-door-company-of-lansing';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Jackson' FROM companies WHERE slug = 'overhead-door-company-of-lansing';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'overhead-door-company-of-marquette-marquette',
  'Overhead Door Company of Marquette',
  4.3, 3, 'Marquette, MI', 'marquette',
  '["Repair", "Installation"]',
  0, 0,
  'Overhead Door Company of Marquette provides garage door installation and service/repair in Marquette, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '906-226-6516', NULL,
  '1009 W Bluff St, Marquette, MI 49855', NULL,
  'https://www.google.com/maps/search/?api=1&query=Overhead+Door+Company+of+Marquette+1009+W+Bluff+St%2C+Marquette%2C+MI+49855+Michigan', 'Current Business Index', 'Medium', 'Upper Peninsula', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'overhead-door-company-of-marquette-marquette';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'overhead-door-company-of-marquette-marquette';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'overhead-door-company-of-marquette-marquette';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'overhead-door-company-of-marquette-marquette';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'overhead-door-company-of-marquette-marquette';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Marquette' FROM companies WHERE slug = 'overhead-door-company-of-marquette-marquette';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'overhead-door-of-ann-arbor',
  'Overhead Door of Ann Arbor',
  4.8, 210, 'Ann Arbor, MI', 'ann-arbor',
  '["Repair", "Installation", "Commercial", "Emergency"]',
  0, 1,
  'Overhead Door Company of Ann Arbor (also serving Battle Creek and Jackson) has provided residential and commercial garage door sales, repair, and 24/7 service for over 40 years.',
  'Mon–Fri, 7am–5pm', '24/7 on-call service', '734-492-1616', NULL,
  '834 Phoenix Dr Ste A, Ann Arbor, MI 48108', 'https://overheaddoormichigan.com/',
  'https://www.google.com/maps/search/?api=1&query=Overhead+Door+Company+of+Ann+Arbor+834+Phoenix+Dr+Ste+A%2C+Ann+Arbor%2C+MI+48108+Michigan', 'Current Business Index', 'Medium', 'Ann Arbor / Livingston', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'overhead-door-of-ann-arbor';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'overhead-door-of-ann-arbor';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'overhead-door-of-ann-arbor';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'overhead-door-of-ann-arbor';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'overhead-door-of-ann-arbor';
INSERT INTO company_services (company_id, service) SELECT id, 'Emergency Service' FROM companies WHERE slug = 'overhead-door-of-ann-arbor';
INSERT INTO company_services (company_id, service) SELECT id, 'Commercial Service' FROM companies WHERE slug = 'overhead-door-of-ann-arbor';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Ann Arbor' FROM companies WHERE slug = 'overhead-door-of-ann-arbor';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Ypsilanti' FROM companies WHERE slug = 'overhead-door-of-ann-arbor';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Saline' FROM companies WHERE slug = 'overhead-door-of-ann-arbor';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Chelsea' FROM companies WHERE slug = 'overhead-door-of-ann-arbor';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Dexter' FROM companies WHERE slug = 'overhead-door-of-ann-arbor';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Jackson' FROM companies WHERE slug = 'overhead-door-of-ann-arbor';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Battle Creek' FROM companies WHERE slug = 'overhead-door-of-ann-arbor';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Brighton' FROM companies WHERE slug = 'overhead-door-of-ann-arbor';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'overhead-door-west-waterford',
  'Overhead Door West',
  0.0, 0, 'Waterford, MI', 'waterford',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'Overhead Door West provides garage door installation and service/repair in Waterford, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '888-278-8402', NULL,
  '4680 Hatchery Road, Waterford, MI 48329', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-2-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'overhead-door-west-waterford';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'overhead-door-west-waterford';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'overhead-door-west-waterford';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'overhead-door-west-waterford';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'overhead-door-west-waterford';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Waterford' FROM companies WHERE slug = 'overhead-door-west-waterford';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'overhead-doors-more-grand-blanc',
  'Overhead Doors & More',
  4.9, 57, 'Grand Blanc, MI', 'grand-blanc',
  '["Repair", "Installation"]',
  0, 0,
  'Overhead Doors & More provides garage door installation and service/repair in Grand Blanc, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '810-553-5212', NULL,
  '6434 S Dort Hwy #3, Grand Blanc, MI 48439', NULL,
  'https://www.google.com/maps/search/?api=1&query=Overhead+Doors+%26+More+6434+S+Dort+Hwy+%233%2C+Grand+Blanc%2C+MI+48439+Michigan', 'Current Business Index', 'High', 'Flint / Genesee / Lapeer', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'overhead-doors-more-grand-blanc';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'overhead-doors-more-grand-blanc';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'overhead-doors-more-grand-blanc';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'overhead-doors-more-grand-blanc';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'overhead-doors-more-grand-blanc';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Grand Blanc' FROM companies WHERE slug = 'overhead-doors-more-grand-blanc';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Flint' FROM companies WHERE slug = 'overhead-doors-more-grand-blanc';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Fenton' FROM companies WHERE slug = 'overhead-doors-more-grand-blanc';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'paramount-garage-doors-llc-new-haven',
  'Paramount Garage Doors LLC',
  5.0, 179, 'New Haven, MI', 'new-haven',
  '["Repair", "Installation"]',
  0, 0,
  'Paramount Garage Doors LLC provides garage door installation and service/repair in New Haven, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '586-277-1315', NULL,
  '32134 Channing St, New Haven, MI 48048', NULL,
  'https://www.google.com/maps/search/?api=1&query=Paramount+Garage+Doors+LLC+32134+Channing+St%2C+New+Haven%2C+MI+48048+Michigan', 'Current Business Index', 'High', 'Port Huron / St. Clair-Macomb', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'paramount-garage-doors-llc-new-haven';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'paramount-garage-doors-llc-new-haven';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'paramount-garage-doors-llc-new-haven';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'paramount-garage-doors-llc-new-haven';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'paramount-garage-doors-llc-new-haven';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'New Haven' FROM companies WHERE slug = 'paramount-garage-doors-llc-new-haven';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Port Huron' FROM companies WHERE slug = 'paramount-garage-doors-llc-new-haven';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Clinton Township' FROM companies WHERE slug = 'paramount-garage-doors-llc-new-haven';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Shelby Township' FROM companies WHERE slug = 'paramount-garage-doors-llc-new-haven';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'performance-fiberglass-inc-shelby-township',
  'Performance Fiberglass Inc',
  0.0, 0, 'Shelby Township, MI', 'shelby-township',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'Performance Fiberglass Inc provides garage door installation and service/repair in Shelby Township, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '586-262-3700', NULL,
  '14017 23 MILE RD, SHELBY TOWNSHIP, MI 48315', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-2-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'performance-fiberglass-inc-shelby-township';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'performance-fiberglass-inc-shelby-township';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'performance-fiberglass-inc-shelby-township';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'performance-fiberglass-inc-shelby-township';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'performance-fiberglass-inc-shelby-township';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Shelby Township' FROM companies WHERE slug = 'performance-fiberglass-inc-shelby-township';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'port-huron-door-service',
  'Port Huron Door Service',
  4.6, 33, 'Port Huron, MI', 'port-huron',
  '["Repair", "Openers", "Installation"]',
  0, 0,
  'Port Huron Door Service covers the Blue Water area with residential garage door repair, openers, and new installs.',
  'Mon–Fri, 8am–5pm', NULL, NULL, NULL,
  NULL, NULL,
  NULL, NULL, NULL, NULL, NULL,
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'port-huron-door-service';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'port-huron-door-service';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'port-huron-door-service';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'port-huron-door-service';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'port-huron-door-service';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Port Huron' FROM companies WHERE slug = 'port-huron-door-service';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Marysville' FROM companies WHERE slug = 'port-huron-door-service';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'St. Clair' FROM companies WHERE slug = 'port-huron-door-service';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Fort Gratiot' FROM companies WHERE slug = 'port-huron-door-service';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'precise-door-company',
  'Precise Door Company',
  4.8, 112, 'Traverse City, MI', 'traverse-city',
  '["Repair", "Installation", "Openers", "Emergency"]',
  0, 1,
  'Precise Door Company is a family-owned Traverse City dealer providing residential and commercial garage door installation, repair, and 24-hour emergency service across Grand Traverse, Leelanau, Benzie, Antrim, and Wexford counties.',
  'Mon–Fri, 8am–5pm', '24-hour emergency service', '231-276-6601', NULL,
  '926 W South Airport Rd, Traverse City, MI 49686', 'https://precisedoorco.com/',
  'https://www.google.com/maps/search/?api=1&query=Precise+Door+Company+926+W+South+Airport+Rd%2C+Traverse+City%2C+MI+49686+Michigan', 'Current Business Index', 'Medium', 'Traverse City / Northern Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'precise-door-company';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'precise-door-company';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'precise-door-company';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'precise-door-company';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'precise-door-company';
INSERT INTO company_services (company_id, service) SELECT id, 'Emergency Service' FROM companies WHERE slug = 'precise-door-company';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Traverse City' FROM companies WHERE slug = 'precise-door-company';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Acme' FROM companies WHERE slug = 'precise-door-company';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Elk Rapids' FROM companies WHERE slug = 'precise-door-company';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Cadillac' FROM companies WHERE slug = 'precise-door-company';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Petoskey' FROM companies WHERE slug = 'precise-door-company';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Interlochen' FROM companies WHERE slug = 'precise-door-company';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Kingsley' FROM companies WHERE slug = 'precise-door-company';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'precision-garage-door-of-michigan',
  'Precision Garage Door of Michigan',
  4.8, 312, 'Detroit, MI', 'detroit',
  '["Repair", "Installation", "Openers", "Emergency"]',
  0, 1,
  'Precision Garage Door of Michigan has served Southeast, Mid, and West Michigan since 2001 with IDEA-certified technicians for repair, openers, and new doors across Detroit, Grand Rapids, Ann Arbor, Lansing, and Kalamazoo.',
  'Mon–Sun, 7am–9pm', '24/7 repair', '734-219-3380', NULL,
  NULL, 'https://precisiondoormi.com/',
  NULL, NULL, NULL, NULL, NULL,
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'precision-garage-door-of-michigan';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'precision-garage-door-of-michigan';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'precision-garage-door-of-michigan';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'precision-garage-door-of-michigan';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'precision-garage-door-of-michigan';
INSERT INTO company_services (company_id, service) SELECT id, 'Emergency Service' FROM companies WHERE slug = 'precision-garage-door-of-michigan';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Detroit' FROM companies WHERE slug = 'precision-garage-door-of-michigan';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Grand Rapids' FROM companies WHERE slug = 'precision-garage-door-of-michigan';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Ann Arbor' FROM companies WHERE slug = 'precision-garage-door-of-michigan';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Lansing' FROM companies WHERE slug = 'precision-garage-door-of-michigan';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Kalamazoo' FROM companies WHERE slug = 'precision-garage-door-of-michigan';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Livonia' FROM companies WHERE slug = 'precision-garage-door-of-michigan';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Warren' FROM companies WHERE slug = 'precision-garage-door-of-michigan';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Troy' FROM companies WHERE slug = 'precision-garage-door-of-michigan';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'precision-garage-door-of-southeast-michigan-ann-arbor',
  'Precision Garage Door of Southeast Michigan',
  4.9, 190, 'Ann Arbor, MI', 'ann-arbor',
  '["Repair", "Installation"]',
  0, 0,
  'Precision Garage Door of Southeast Michigan provides garage door installation and service/repair in Ann Arbor, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '734-224-5537', NULL,
  '3300 Washtenaw Ave Ste 295, Ann Arbor, MI 48104', NULL,
  'https://www.google.com/maps/search/?api=1&query=Precision+Garage+Door+of+Southeast+Michigan+3300+Washtenaw+Ave+Ste+295%2C+Ann+Arbor%2C+MI+48104+Michigan', 'Current Business Index', 'High', 'Ann Arbor / Livingston', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'precision-garage-door-of-southeast-michigan-ann-arbor';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'precision-garage-door-of-southeast-michigan-ann-arbor';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'precision-garage-door-of-southeast-michigan-ann-arbor';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'precision-garage-door-of-southeast-michigan-ann-arbor';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'precision-garage-door-of-southeast-michigan-ann-arbor';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Ann Arbor' FROM companies WHERE slug = 'precision-garage-door-of-southeast-michigan-ann-arbor';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Ypsilanti' FROM companies WHERE slug = 'precision-garage-door-of-southeast-michigan-ann-arbor';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Brighton' FROM companies WHERE slug = 'precision-garage-door-of-southeast-michigan-ann-arbor';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Howell' FROM companies WHERE slug = 'precision-garage-door-of-southeast-michigan-ann-arbor';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'precision-garage-door-of-southeast-michigan-grosse-pointe',
  'Precision Garage Door of Southeast Michigan',
  4.7, 327, 'Grosse Pointe Woods, MI', 'grosse-pointe-woods',
  '["Repair", "Installation"]',
  0, 0,
  'Precision Garage Door of Southeast Michigan provides garage door installation and service/repair in Grosse Pointe Woods, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '313-355-0998', NULL,
  '20233 Mack Ave, Grosse Pointe Woods, MI 48236', NULL,
  'https://www.google.com/maps/search/?api=1&query=Precision+Garage+Door+of+Southeast+Michigan+20233+Mack+Ave%2C+Grosse+Pointe+Woods%2C+MI+48236+Michigan', 'Current Business Index', 'High', 'Detroit / Southeast Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'precision-garage-door-of-southeast-michigan-grosse-pointe';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'precision-garage-door-of-southeast-michigan-grosse-pointe';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'precision-garage-door-of-southeast-michigan-grosse-pointe';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'precision-garage-door-of-southeast-michigan-grosse-pointe';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'precision-garage-door-of-southeast-michigan-grosse-pointe';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Grosse Pointe Woods' FROM companies WHERE slug = 'precision-garage-door-of-southeast-michigan-grosse-pointe';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Detroit' FROM companies WHERE slug = 'precision-garage-door-of-southeast-michigan-grosse-pointe';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Warren' FROM companies WHERE slug = 'precision-garage-door-of-southeast-michigan-grosse-pointe';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Dearborn' FROM companies WHERE slug = 'precision-garage-door-of-southeast-michigan-grosse-pointe';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Livonia' FROM companies WHERE slug = 'precision-garage-door-of-southeast-michigan-grosse-pointe';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'precision-garage-door-of-west-michigan-grand-rapids',
  'Precision Garage Door of West Michigan',
  4.8, 1927, 'Grand Rapids, MI', 'grand-rapids',
  '["Repair", "Installation"]',
  0, 0,
  'Precision Garage Door of West Michigan provides garage door installation and service/repair in Grand Rapids, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '616-239-2718', NULL,
  NULL, NULL,
  'https://www.google.com/maps/search/?api=1&query=Precision+Garage+Door+of+West+Michigan+Grand+Rapids+Michigan', 'Current Business Index', 'High', 'Grand Rapids / West Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'precision-garage-door-of-west-michigan-grand-rapids';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'precision-garage-door-of-west-michigan-grand-rapids';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'precision-garage-door-of-west-michigan-grand-rapids';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'precision-garage-door-of-west-michigan-grand-rapids';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'precision-garage-door-of-west-michigan-grand-rapids';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Grand Rapids' FROM companies WHERE slug = 'precision-garage-door-of-west-michigan-grand-rapids';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Wyoming' FROM companies WHERE slug = 'precision-garage-door-of-west-michigan-grand-rapids';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Holland' FROM companies WHERE slug = 'precision-garage-door-of-west-michigan-grand-rapids';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'precision-garage-door-of-west-michigan-kalamazoo-kalamazoo',
  'Precision Garage Door of West Michigan (Kalamazoo)',
  4.8, 350, 'Kalamazoo, MI', 'kalamazoo',
  '["Repair", "Installation"]',
  0, 0,
  'Precision Garage Door of West Michigan (Kalamazoo) provides garage door installation and service/repair in Kalamazoo, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '269-218-0623', NULL,
  '5955 W Main St Ste 503, Kalamazoo, MI 49009', NULL,
  'https://www.google.com/maps/search/?api=1&query=Precision+Garage+Door+of+West+Michigan+%28Kalamazoo%29+5955+W+Main+St+Ste+503%2C+Kalamazoo%2C+MI+49009+Michigan', 'Current Business Index', 'High', 'Kalamazoo / Southwest Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'precision-garage-door-of-west-michigan-kalamazoo-kalamazoo';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'precision-garage-door-of-west-michigan-kalamazoo-kalamazoo';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'precision-garage-door-of-west-michigan-kalamazoo-kalamazoo';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'precision-garage-door-of-west-michigan-kalamazoo-kalamazoo';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'precision-garage-door-of-west-michigan-kalamazoo-kalamazoo';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Kalamazoo' FROM companies WHERE slug = 'precision-garage-door-of-west-michigan-kalamazoo-kalamazoo';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Portage' FROM companies WHERE slug = 'precision-garage-door-of-west-michigan-kalamazoo-kalamazoo';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Battle Creek' FROM companies WHERE slug = 'precision-garage-door-of-west-michigan-kalamazoo-kalamazoo';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'precision-garage-door-service-of-saginaw-saginaw',
  'Precision Garage Door Service of Saginaw',
  5.0, 34, 'Saginaw, MI', 'saginaw',
  '["Repair", "Installation"]',
  0, 0,
  'Precision Garage Door Service of Saginaw provides garage door installation and service/repair in Saginaw, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '989-778-6515', NULL,
  '6321 Normandy Dr #4, Saginaw, MI 48638', NULL,
  'https://www.google.com/maps/search/?api=1&query=Precision+Garage+Door+Service+of+Saginaw+6321+Normandy+Dr+%234%2C+Saginaw%2C+MI+48638+Michigan', 'Current Business Index', 'High', 'Saginaw / Great Lakes Bay', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'precision-garage-door-service-of-saginaw-saginaw';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'precision-garage-door-service-of-saginaw-saginaw';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'precision-garage-door-service-of-saginaw-saginaw';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'precision-garage-door-service-of-saginaw-saginaw';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'precision-garage-door-service-of-saginaw-saginaw';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Saginaw' FROM companies WHERE slug = 'precision-garage-door-service-of-saginaw-saginaw';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Bay City' FROM companies WHERE slug = 'precision-garage-door-service-of-saginaw-saginaw';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Midland' FROM companies WHERE slug = 'precision-garage-door-service-of-saginaw-saginaw';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'professional-overhead-door',
  'Professional Overhead Door',
  4.8, 25, 'Grand Rapids, MI', 'grand-rapids',
  '["Repair", "Installation", "Openers", "Clopay Dealer"]',
  0, 0,
  'Professional Overhead Door provides residential garage door sales, service, and opener installs in the Grand Rapids area.',
  'Mon–Fri, 8am–5pm', NULL, '616-361-4477', NULL,
  '4061 PLAINFIELD AVE NE STE C, GRAND RAPIDS, MI 49525-1632', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-3-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'professional-overhead-door';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'professional-overhead-door';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'professional-overhead-door';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'professional-overhead-door';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'professional-overhead-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Grand Rapids' FROM companies WHERE slug = 'professional-overhead-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Wyoming' FROM companies WHERE slug = 'professional-overhead-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Kentwood' FROM companies WHERE slug = 'professional-overhead-door';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'prolift-garage-doors-of-grand-rapids-grand-haven',
  'ProLift Garage Doors of Grand Rapids',
  5.0, 536, 'Grand Haven, MI', 'grand-haven',
  '["Repair", "Installation"]',
  0, 0,
  'ProLift Garage Doors of Grand Rapids provides garage door installation and service/repair in Grand Haven, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '616-426-6059', NULL,
  NULL, NULL,
  'https://www.google.com/maps/search/?api=1&query=ProLift+Garage+Doors+of+Grand+Rapids+Grand+Haven+Michigan', 'Current Business Index', 'High', 'Grand Rapids / West Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'prolift-garage-doors-of-grand-rapids-grand-haven';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'prolift-garage-doors-of-grand-rapids-grand-haven';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'prolift-garage-doors-of-grand-rapids-grand-haven';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'prolift-garage-doors-of-grand-rapids-grand-haven';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'prolift-garage-doors-of-grand-rapids-grand-haven';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Grand Haven' FROM companies WHERE slug = 'prolift-garage-doors-of-grand-rapids-grand-haven';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Grand Rapids' FROM companies WHERE slug = 'prolift-garage-doors-of-grand-rapids-grand-haven';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Wyoming' FROM companies WHERE slug = 'prolift-garage-doors-of-grand-rapids-grand-haven';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Holland' FROM companies WHERE slug = 'prolift-garage-doors-of-grand-rapids-grand-haven';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'proper-garage-doors-llc-shelby-township',
  'Proper Garage Doors LLC',
  0.0, 0, 'Shelby Township, MI', 'shelby-township',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'Proper Garage Doors LLC provides garage door installation and service/repair in Shelby Township, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '586-531-6764', NULL,
  '50437 Hayes Rd, Shelby Township, MI 48315', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-3-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'proper-garage-doors-llc-shelby-township';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'proper-garage-doors-llc-shelby-township';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'proper-garage-doors-llc-shelby-township';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'proper-garage-doors-llc-shelby-township';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'proper-garage-doors-llc-shelby-township';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Shelby Township' FROM companies WHERE slug = 'proper-garage-doors-llc-shelby-township';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'pure-michigan-garage-door-llc-white-cloud',
  'Pure Michigan Garage Door LLC',
  4.9, 76, 'White Cloud, MI', 'white-cloud',
  '["Repair", "Installation"]',
  0, 0,
  'Pure Michigan Garage Door LLC provides garage door installation and service/repair in White Cloud, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '231-250-9451', NULL,
  '2892 W 12th St, White Cloud, MI 49349', NULL,
  'https://www.google.com/maps/search/?api=1&query=Pure+Michigan+Garage+Door+LLC+2892+W+12th+St%2C+White+Cloud%2C+MI+49349+Michigan', 'Current Business Index', 'High', 'Traverse City / Northern Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'pure-michigan-garage-door-llc-white-cloud';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'pure-michigan-garage-door-llc-white-cloud';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'pure-michigan-garage-door-llc-white-cloud';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'pure-michigan-garage-door-llc-white-cloud';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'pure-michigan-garage-door-llc-white-cloud';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'White Cloud' FROM companies WHERE slug = 'pure-michigan-garage-door-llc-white-cloud';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Traverse City' FROM companies WHERE slug = 'pure-michigan-garage-door-llc-white-cloud';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Cadillac' FROM companies WHERE slug = 'pure-michigan-garage-door-llc-white-cloud';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Petoskey' FROM companies WHERE slug = 'pure-michigan-garage-door-llc-white-cloud';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'quality-door-holland',
  'Quality Door',
  0.0, 0, 'Holland, MI', 'holland',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'Quality Door provides garage door installation and service/repair in Holland, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '616-399-3157', NULL,
  '2481 Van Ommen Dr, Holland, MI 49424', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-3-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'quality-door-holland';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'quality-door-holland';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'quality-door-holland';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'quality-door-holland';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'quality-door-holland';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Holland' FROM companies WHERE slug = 'quality-door-holland';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'quality-door-operator-muskegon-muskegon',
  'Quality Door & Operator - Muskegon',
  0.0, 0, 'Muskegon, MI', 'muskegon',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'Quality Door & Operator - Muskegon provides garage door installation and service/repair in Muskegon, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '231-241-9555', NULL,
  '5600 GRAND HAVEN ROAD, MUSKEGON, MI 49441-6006', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-3-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'quality-door-operator-muskegon-muskegon';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'quality-door-operator-muskegon-muskegon';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'quality-door-operator-muskegon-muskegon';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'quality-door-operator-muskegon-muskegon';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'quality-door-operator-muskegon-muskegon';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Muskegon' FROM companies WHERE slug = 'quality-door-operator-muskegon-muskegon';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'quality-door-of-grand-rapids',
  'Quality Door of Grand Rapids',
  5.0, 49, 'Grand Rapids, MI', 'grand-rapids',
  '["Repair", "Installation", "Maintenance"]',
  0, 0,
  'Quality Door of Grand Rapids is a local shop focused on careful residential garage door repair and replacement.',
  'Mon–Fri, 8am–5pm', NULL, '616-466-4826', NULL,
  NULL, NULL,
  'https://www.google.com/maps/search/?api=1&query=Grand+Rapids+Door+Grand+Rapids+Michigan', 'Current Business Index', 'High', 'Grand Rapids / West Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'quality-door-of-grand-rapids';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'quality-door-of-grand-rapids';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'quality-door-of-grand-rapids';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'quality-door-of-grand-rapids';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'quality-door-of-grand-rapids';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Grand Rapids' FROM companies WHERE slug = 'quality-door-of-grand-rapids';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Kentwood' FROM companies WHERE slug = 'quality-door-of-grand-rapids';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Walker' FROM companies WHERE slug = 'quality-door-of-grand-rapids';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'quality-door-of-grand-rapids-inc-grand-rapids',
  'Quality Door of Grand Rapids Inc',
  0.0, 0, 'Grand Rapids, MI', 'grand-rapids',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'Quality Door of Grand Rapids Inc provides garage door installation and service/repair in Grand Rapids, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '616-698-8868', NULL,
  '4175 E Paris Ave SE, Grand Rapids, MI 49512', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-3-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'quality-door-of-grand-rapids-inc-grand-rapids';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'quality-door-of-grand-rapids-inc-grand-rapids';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'quality-door-of-grand-rapids-inc-grand-rapids';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'quality-door-of-grand-rapids-inc-grand-rapids';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'quality-door-of-grand-rapids-inc-grand-rapids';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Grand Rapids' FROM companies WHERE slug = 'quality-door-of-grand-rapids-inc-grand-rapids';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'quality-door-of-south-haven-inc-south-haven',
  'Quality Door of South Haven Inc.',
  0.0, 0, 'South Haven, MI', 'south-haven',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'Quality Door of South Haven Inc. provides garage door installation and service/repair in South Haven, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '269-637-8761', NULL,
  '05666 CR 687, South Haven, MI 49090', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-3-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'quality-door-of-south-haven-inc-south-haven';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'quality-door-of-south-haven-inc-south-haven';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'quality-door-of-south-haven-inc-south-haven';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'quality-door-of-south-haven-inc-south-haven';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'quality-door-of-south-haven-inc-south-haven';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'South Haven' FROM companies WHERE slug = 'quality-door-of-south-haven-inc-south-haven';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'quality-garage-doors-west-branch',
  'Quality Garage Doors',
  0.0, 0, 'West Branch, MI', 'west-branch',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'Quality Garage Doors provides garage door installation and service/repair in West Branch, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '989-345-5633', NULL,
  '2510 S M-76, West Branch, MI 48661', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-3-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'quality-garage-doors-west-branch';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'quality-garage-doors-west-branch';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'quality-garage-doors-west-branch';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'quality-garage-doors-west-branch';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'quality-garage-doors-west-branch';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'West Branch' FROM companies WHERE slug = 'quality-garage-doors-west-branch';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'r-m-overhead-door-llc-menominee',
  'R & M Overhead Door, LLC',
  5.0, 11, 'Menominee, MI', 'menominee',
  '["Repair", "Installation"]',
  0, 0,
  'R & M Overhead Door, LLC provides garage door installation and service/repair in Menominee, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '715-587-6270', NULL,
  '1408 28th Ave, Menominee, MI 49858', NULL,
  'https://www.google.com/maps/search/?api=1&query=R+%26+M+Overhead+Door%2C+LLC+1408+28th+Ave%2C+Menominee%2C+MI+49858+Michigan', 'Current Business Index', 'High', 'Upper Peninsula', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'r-m-overhead-door-llc-menominee';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'r-m-overhead-door-llc-menominee';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'r-m-overhead-door-llc-menominee';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'r-m-overhead-door-llc-menominee';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'r-m-overhead-door-llc-menominee';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Menominee' FROM companies WHERE slug = 'r-m-overhead-door-llc-menominee';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Marquette' FROM companies WHERE slug = 'r-m-overhead-door-llc-menominee';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'rapid-garage-door-service-hudsonville',
  'Rapid Garage Door Service',
  5.0, 118, 'Hudsonville, MI', 'hudsonville',
  '["Repair", "Installation"]',
  0, 0,
  'Rapid Garage Door Service provides garage door installation and service/repair in Hudsonville, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '616-647-8727', NULL,
  NULL, NULL,
  'https://www.google.com/maps/search/?api=1&query=Rapid+Garage+Door+Service+Hudsonville+Michigan', 'Current Business Index', 'High', 'Grand Rapids / West Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'rapid-garage-door-service-hudsonville';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'rapid-garage-door-service-hudsonville';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'rapid-garage-door-service-hudsonville';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'rapid-garage-door-service-hudsonville';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'rapid-garage-door-service-hudsonville';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Hudsonville' FROM companies WHERE slug = 'rapid-garage-door-service-hudsonville';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Grand Rapids' FROM companies WHERE slug = 'rapid-garage-door-service-hudsonville';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Wyoming' FROM companies WHERE slug = 'rapid-garage-door-service-hudsonville';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Holland' FROM companies WHERE slug = 'rapid-garage-door-service-hudsonville';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'redwood-door-inc-dba-crawford-door-sales-ypsilanti',
  'Redwood Door Inc Dba Crawford Door Sales',
  0.0, 0, 'Ypsilanti, MI', 'ypsilanti',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'Redwood Door Inc Dba Crawford Door Sales provides garage door installation and service/repair in Ypsilanti, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '734-483-4563', NULL,
  '334 East Michigan Avenue, Ypsilanti, MI 48198-5620', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-3-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'redwood-door-inc-dba-crawford-door-sales-ypsilanti';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'redwood-door-inc-dba-crawford-door-sales-ypsilanti';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'redwood-door-inc-dba-crawford-door-sales-ypsilanti';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'redwood-door-inc-dba-crawford-door-sales-ypsilanti';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'redwood-door-inc-dba-crawford-door-sales-ypsilanti';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Ypsilanti' FROM companies WHERE slug = 'redwood-door-inc-dba-crawford-door-sales-ypsilanti';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'reliable-doors-inc-lapeer',
  'Reliable Doors Inc',
  4.9, 70, 'Lapeer, MI', 'lapeer',
  '["Repair", "Installation"]',
  0, 0,
  'Reliable Doors Inc provides garage door installation and service/repair in Lapeer, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '810-358-0689', NULL,
  NULL, NULL,
  'https://www.google.com/maps/search/?api=1&query=Reliable+Doors+Inc+Lapeer+Michigan', 'Current Business Index', 'High', 'Flint / Genesee / Lapeer', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'reliable-doors-inc-lapeer';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'reliable-doors-inc-lapeer';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'reliable-doors-inc-lapeer';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'reliable-doors-inc-lapeer';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'reliable-doors-inc-lapeer';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Lapeer' FROM companies WHERE slug = 'reliable-doors-inc-lapeer';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Flint' FROM companies WHERE slug = 'reliable-doors-inc-lapeer';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Grand Blanc' FROM companies WHERE slug = 'reliable-doors-inc-lapeer';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Fenton' FROM companies WHERE slug = 'reliable-doors-inc-lapeer';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'rescom-door-pinckney',
  'Rescom Door',
  5.0, 178, 'Pinckney, MI', 'pinckney',
  '["Repair", "Installation"]',
  0, 0,
  'Rescom Door provides garage door installation and service/repair in Pinckney, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '810-247-4906', NULL,
  '4088 M-36, Pinckney, MI 48169', NULL,
  'https://www.google.com/maps/search/?api=1&query=Rescom+Door+4088+M-36%2C+Pinckney%2C+MI+48169+Michigan', 'Current Business Index', 'High', 'Ann Arbor / Livingston', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'rescom-door-pinckney';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'rescom-door-pinckney';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'rescom-door-pinckney';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'rescom-door-pinckney';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'rescom-door-pinckney';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Pinckney' FROM companies WHERE slug = 'rescom-door-pinckney';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Ann Arbor' FROM companies WHERE slug = 'rescom-door-pinckney';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Ypsilanti' FROM companies WHERE slug = 'rescom-door-pinckney';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Brighton' FROM companies WHERE slug = 'rescom-door-pinckney';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Howell' FROM companies WHERE slug = 'rescom-door-pinckney';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'residential-garage-door-petoskey',
  'Residential Garage Door',
  0.0, 0, 'Petoskey, MI', 'petoskey',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'Residential Garage Door provides garage door installation and service/repair in Petoskey, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '231-347-8594', NULL,
  '803 East Mitchell Street, Petoskey, MI 49770-2631', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-3-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'residential-garage-door-petoskey';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'residential-garage-door-petoskey';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'residential-garage-door-petoskey';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'residential-garage-door-petoskey';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'residential-garage-door-petoskey';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Petoskey' FROM companies WHERE slug = 'residential-garage-door-petoskey';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'robs-garage-door-repair-ypsilanti',
  'Robs Garage Door - Repair',
  5.0, 454, 'Ypsilanti, MI', 'ypsilanti',
  '["Repair", "Installation"]',
  0, 0,
  'Robs Garage Door - Repair provides garage door installation and service/repair in Ypsilanti, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '734-301-5959', NULL,
  '240 Kansas Ave, Ypsilanti, MI 48198', NULL,
  'https://www.google.com/maps/search/?api=1&query=Robs+Garage+Door+-+Repair+240+Kansas+Ave%2C+Ypsilanti%2C+MI+48198+Michigan', 'Current Business Index', 'High', 'Ann Arbor / Livingston', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'robs-garage-door-repair-ypsilanti';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'robs-garage-door-repair-ypsilanti';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'robs-garage-door-repair-ypsilanti';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'robs-garage-door-repair-ypsilanti';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'robs-garage-door-repair-ypsilanti';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Ypsilanti' FROM companies WHERE slug = 'robs-garage-door-repair-ypsilanti';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Ann Arbor' FROM companies WHERE slug = 'robs-garage-door-repair-ypsilanti';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Brighton' FROM companies WHERE slug = 'robs-garage-door-repair-ypsilanti';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Howell' FROM companies WHERE slug = 'robs-garage-door-repair-ypsilanti';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'saginaw-valley-garage-doors',
  'Saginaw Valley Garage Doors',
  4.7, 67, 'Saginaw, MI', 'saginaw',
  '["Repair", "Openers", "Installation"]',
  0, 0,
  'Saginaw Valley Garage Doors serves Saginaw, Bay City, and Midland with residential garage door repair, openers, and installation.',
  'Mon–Fri, 8am–5pm', NULL, '989-751-0623', NULL,
  '3528 East St, Saginaw, MI 48601', NULL,
  'https://www.google.com/maps/search/?api=1&query=Valley+Garage+Door+Services+3528+East+St%2C+Saginaw%2C+MI+48601+Michigan', 'Current Business Index', 'Medium', 'Saginaw / Great Lakes Bay', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'saginaw-valley-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'saginaw-valley-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'saginaw-valley-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'saginaw-valley-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'saginaw-valley-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Saginaw' FROM companies WHERE slug = 'saginaw-valley-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Bay City' FROM companies WHERE slug = 'saginaw-valley-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Midland' FROM companies WHERE slug = 'saginaw-valley-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Freeland' FROM companies WHERE slug = 'saginaw-valley-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Essexville' FROM companies WHERE slug = 'saginaw-valley-garage-doors';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'sam-s-garage-door-services-canton',
  'Sam''s Garage Door Services',
  4.9, 278, 'Canton, MI', 'canton',
  '["Repair", "Installation"]',
  0, 0,
  'Sam''s Garage Door Services provides garage door installation and service/repair in Canton, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '734-221-0620', NULL,
  '5840 N Canton Center Rd Ste 297, Canton Township, MI 48187', NULL,
  'https://www.google.com/maps/search/?api=1&query=Sam%27s+Garage+Door+Services+5840+N+Canton+Center+Rd+Ste+297%2C+Canton+Township%2C+MI+48187+Michigan', 'Current Business Index', 'High', 'Detroit / Southeast Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'sam-s-garage-door-services-canton';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'sam-s-garage-door-services-canton';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'sam-s-garage-door-services-canton';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'sam-s-garage-door-services-canton';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'sam-s-garage-door-services-canton';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Canton' FROM companies WHERE slug = 'sam-s-garage-door-services-canton';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Detroit' FROM companies WHERE slug = 'sam-s-garage-door-services-canton';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Warren' FROM companies WHERE slug = 'sam-s-garage-door-services-canton';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Dearborn' FROM companies WHERE slug = 'sam-s-garage-door-services-canton';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Livonia' FROM companies WHERE slug = 'sam-s-garage-door-services-canton';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'schweihofer-doors-inc-st-clair',
  'Schweihofer Doors Inc',
  0.0, 0, 'St. Clair, MI', 'st-clair',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'Schweihofer Doors Inc provides garage door installation and service/repair in St. Clair, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '810-329-4093', NULL,
  '4737 RATTLE RUN RD, SAINT CLAIR, MI 48079-4728', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-3-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'schweihofer-doors-inc-st-clair';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'schweihofer-doors-inc-st-clair';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'schweihofer-doors-inc-st-clair';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'schweihofer-doors-inc-st-clair';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'schweihofer-doors-inc-st-clair';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'St. Clair' FROM companies WHERE slug = 'schweihofer-doors-inc-st-clair';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'shepherd-shoreline-gutters-garage-doors-norton-shores',
  'Shepherd Shoreline Gutters & Garage Doors',
  4.3, 51, 'Norton Shores, MI', 'norton-shores',
  '["Repair", "Installation"]',
  0, 0,
  'Shepherd Shoreline Gutters & Garage Doors provides garage door installation and service/repair in Norton Shores, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '231-780-2847', NULL,
  '950 E Broadway Ave, Norton Shores, MI 49444', NULL,
  'https://www.google.com/maps/search/?api=1&query=Shepherd+Shoreline+Gutters+%26+Garage+Doors+950+E+Broadway+Ave%2C+Norton+Shores%2C+MI+49444+Michigan', 'Current Business Index', 'High', 'Muskegon / Lakeshore', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'shepherd-shoreline-gutters-garage-doors-norton-shores';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'shepherd-shoreline-gutters-garage-doors-norton-shores';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'shepherd-shoreline-gutters-garage-doors-norton-shores';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'shepherd-shoreline-gutters-garage-doors-norton-shores';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'shepherd-shoreline-gutters-garage-doors-norton-shores';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Norton Shores' FROM companies WHERE slug = 'shepherd-shoreline-gutters-garage-doors-norton-shores';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Muskegon' FROM companies WHERE slug = 'shepherd-shoreline-gutters-garage-doors-norton-shores';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Holland' FROM companies WHERE slug = 'shepherd-shoreline-gutters-garage-doors-norton-shores';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'southwest-michigan-garage-doors',
  'Southwest Michigan Garage Doors',
  4.6, 47, 'Portage, MI', 'portage',
  '["Repair", "Springs", "Installation"]',
  0, 0,
  'Southwest Michigan Garage Doors serves Portage, Kalamazoo, and Battle Creek with residential spring repair and door replacement.',
  'Mon–Sat, 7am–6pm', NULL, NULL, NULL,
  NULL, NULL,
  NULL, NULL, NULL, NULL, NULL,
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'southwest-michigan-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'southwest-michigan-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'southwest-michigan-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'southwest-michigan-garage-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'southwest-michigan-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Portage' FROM companies WHERE slug = 'southwest-michigan-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Kalamazoo' FROM companies WHERE slug = 'southwest-michigan-garage-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Battle Creek' FROM companies WHERE slug = 'southwest-michigan-garage-doors';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'st-joseph-lakeshore-doors',
  'St. Joseph Lakeshore Doors',
  4.6, 31, 'Benton Harbor, MI', 'benton-harbor',
  '["Repair", "Installation", "Openers"]',
  0, 0,
  'St. Joseph Lakeshore Doors serves Benton Harbor, St. Joseph, and Southwest Michigan lakeshore towns with residential garage door service.',
  'Mon–Fri, 8am–5pm', NULL, NULL, NULL,
  NULL, NULL,
  NULL, NULL, NULL, NULL, NULL,
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'st-joseph-lakeshore-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'st-joseph-lakeshore-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'st-joseph-lakeshore-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'st-joseph-lakeshore-doors';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'st-joseph-lakeshore-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Benton Harbor' FROM companies WHERE slug = 'st-joseph-lakeshore-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Saint Joseph' FROM companies WHERE slug = 'st-joseph-lakeshore-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Niles' FROM companies WHERE slug = 'st-joseph-lakeshore-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'South Haven' FROM companies WHERE slug = 'st-joseph-lakeshore-doors';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Kalamazoo' FROM companies WHERE slug = 'st-joseph-lakeshore-doors';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'stellar-overhead-door-co-pullman',
  'Stellar Overhead Door Co.',
  5.0, 78, 'Pullman, MI', 'pullman',
  '["Repair", "Installation"]',
  0, 0,
  'Stellar Overhead Door Co. provides garage door installation and service/repair in Pullman, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '989-701-9820', NULL,
  '872 56th St, Pullman, MI 49450', NULL,
  'https://www.google.com/maps/search/?api=1&query=Stellar+Overhead+Door+Co.+872+56th+St%2C+Pullman%2C+MI+49450+Michigan', 'Current Business Index', 'High', 'Kalamazoo / Southwest Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'stellar-overhead-door-co-pullman';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'stellar-overhead-door-co-pullman';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'stellar-overhead-door-co-pullman';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'stellar-overhead-door-co-pullman';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'stellar-overhead-door-co-pullman';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Pullman' FROM companies WHERE slug = 'stellar-overhead-door-co-pullman';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Kalamazoo' FROM companies WHERE slug = 'stellar-overhead-door-co-pullman';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Portage' FROM companies WHERE slug = 'stellar-overhead-door-co-pullman';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Battle Creek' FROM companies WHERE slug = 'stellar-overhead-door-co-pullman';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'sterling-door-inst-macomb',
  'Sterling Door Inst',
  0.0, 0, 'Macomb, MI', 'macomb',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'Sterling Door Inst provides garage door installation and service/repair in Macomb, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '586-979-2376', NULL,
  '46538 White Cap Drive, Macomb Town, MI 48044-5731', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-3-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'sterling-door-inst-macomb';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'sterling-door-inst-macomb';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'sterling-door-inst-macomb';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'sterling-door-inst-macomb';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'sterling-door-inst-macomb';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Macomb' FROM companies WHERE slug = 'sterling-door-inst-macomb';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'sterling-garage-door-sterling-heights',
  'Sterling Garage Door',
  4.9, 734, 'Sterling Heights, MI', 'sterling-heights',
  '["Repair", "Installation"]',
  0, 0,
  'Sterling Garage Door provides garage door installation and service/repair in Sterling Heights, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '586-412-5600', NULL,
  NULL, NULL,
  'https://www.google.com/maps/search/?api=1&query=Sterling+Garage+Door+Sterling+Heights+Michigan', 'Current Business Index', 'High', 'Detroit / Southeast Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'sterling-garage-door-sterling-heights';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'sterling-garage-door-sterling-heights';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'sterling-garage-door-sterling-heights';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'sterling-garage-door-sterling-heights';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'sterling-garage-door-sterling-heights';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Sterling Heights' FROM companies WHERE slug = 'sterling-garage-door-sterling-heights';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Detroit' FROM companies WHERE slug = 'sterling-garage-door-sterling-heights';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Warren' FROM companies WHERE slug = 'sterling-garage-door-sterling-heights';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Dearborn' FROM companies WHERE slug = 'sterling-garage-door-sterling-heights';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Livonia' FROM companies WHERE slug = 'sterling-garage-door-sterling-heights';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'stockbridge-overhead-doors-munith',
  'Stockbridge Overhead Doors',
  0.0, 0, 'Munith, MI', 'munith',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'Stockbridge Overhead Doors provides garage door installation and service/repair in Munith, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '517-851-7291', NULL,
  '10881 TERRITORIAL ROAD, MUNITH, MI 49259-9707', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-3-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'stockbridge-overhead-doors-munith';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'stockbridge-overhead-doors-munith';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'stockbridge-overhead-doors-munith';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'stockbridge-overhead-doors-munith';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'stockbridge-overhead-doors-munith';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Munith' FROM companies WHERE slug = 'stockbridge-overhead-doors-munith';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'suburban-door-company',
  'Suburban Door Company',
  5.0, 120, 'Detroit, MI', 'detroit',
  '["Installation", "Repair", "Commercial"]',
  0, 0,
  'Suburban Door Company has served Metro Detroit since 1948 with residential and commercial garage door installation, repair, and opener systems.',
  'Mon–Fri, 7am–5pm', NULL, NULL, NULL,
  NULL, NULL,
  NULL, NULL, NULL, NULL, NULL,
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'suburban-door-company';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'suburban-door-company';
INSERT INTO company_services (company_id, service) SELECT id, 'Commercial Service' FROM companies WHERE slug = 'suburban-door-company';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'suburban-door-company';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'suburban-door-company';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'suburban-door-company';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Detroit' FROM companies WHERE slug = 'suburban-door-company';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Livonia' FROM companies WHERE slug = 'suburban-door-company';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Farmington Hills' FROM companies WHERE slug = 'suburban-door-company';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Troy' FROM companies WHERE slug = 'suburban-door-company';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Novi' FROM companies WHERE slug = 'suburban-door-company';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Canton' FROM companies WHERE slug = 'suburban-door-company';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Westland' FROM companies WHERE slug = 'suburban-door-company';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'tarnow-door-company-farmington-hills',
  'Tarnow Door Company',
  0.0, 0, 'Farmington Hills, MI', 'farmington-hills',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'Tarnow Door Company provides garage door installation and service/repair in Farmington Hills, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '248-478-9060', NULL,
  '23701 HALSTED ROAD, FARMINGTON HILLS, MI 48335', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-3-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'tarnow-door-company-farmington-hills';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'tarnow-door-company-farmington-hills';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'tarnow-door-company-farmington-hills';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'tarnow-door-company-farmington-hills';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'tarnow-door-company-farmington-hills';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Farmington Hills' FROM companies WHERE slug = 'tarnow-door-company-farmington-hills';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'taylor-door-co-of-st-clair-county-st',
  'Taylor Door Co of St Clair County',
  0.0, 0, 'St. Clair Shores, MI', 'st-clair-shores',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'Taylor Door Co of St Clair County provides garage door installation and service/repair in St. Clair Shores, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '586-755-6500', NULL,
  '20525 E 9 Mile Road, St. Clair Shores, MI 48080', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-3-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'taylor-door-co-of-st-clair-county-st';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'taylor-door-co-of-st-clair-county-st';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'taylor-door-co-of-st-clair-county-st';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'taylor-door-co-of-st-clair-county-st';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'taylor-door-co-of-st-clair-county-st';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'St. Clair Shores' FROM companies WHERE slug = 'taylor-door-co-of-st-clair-county-st';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'the-garage-door-guy-trenton',
  'The Garage Door Guy',
  4.9, 881, 'Trenton, MI', 'trenton',
  '["Repair", "Installation"]',
  0, 0,
  'The Garage Door Guy provides garage door installation and service/repair in Trenton, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '734-672-1764', NULL,
  'Gudith Rd, Trenton, MI 48183', NULL,
  'https://www.google.com/maps/search/?api=1&query=The+Garage+Door+Guy+Gudith+Rd%2C+Trenton%2C+MI+48183+Michigan', 'Current Business Index', 'High', 'Detroit / Southeast Michigan', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'the-garage-door-guy-trenton';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'the-garage-door-guy-trenton';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'the-garage-door-guy-trenton';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'the-garage-door-guy-trenton';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'the-garage-door-guy-trenton';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Trenton' FROM companies WHERE slug = 'the-garage-door-guy-trenton';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Detroit' FROM companies WHERE slug = 'the-garage-door-guy-trenton';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Warren' FROM companies WHERE slug = 'the-garage-door-guy-trenton';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Dearborn' FROM companies WHERE slug = 'the-garage-door-guy-trenton';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Livonia' FROM companies WHERE slug = 'the-garage-door-guy-trenton';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'town-and-country-door',
  'Town & Country Door LLC',
  4.8, 932, 'Detroit, MI', 'detroit',
  '["Repair", "Installation", "Commercial", "Emergency"]',
  0, 1,
  'Town & Country Door LLC has served Metro Detroit since 1995 with residential and commercial garage door installation, repair, and emergency service.',
  'Mon–Sat, 7am–7pm', 'Emergency services offered', NULL, NULL,
  NULL, NULL,
  NULL, NULL, NULL, NULL, NULL,
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'town-and-country-door';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'town-and-country-door';
INSERT INTO company_services (company_id, service) SELECT id, 'Commercial Service' FROM companies WHERE slug = 'town-and-country-door';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'town-and-country-door';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'town-and-country-door';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'town-and-country-door';
INSERT INTO company_services (company_id, service) SELECT id, 'Emergency Service' FROM companies WHERE slug = 'town-and-country-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Detroit' FROM companies WHERE slug = 'town-and-country-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Dearborn' FROM companies WHERE slug = 'town-and-country-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Warren' FROM companies WHERE slug = 'town-and-country-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Livonia' FROM companies WHERE slug = 'town-and-country-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Troy' FROM companies WHERE slug = 'town-and-country-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Sterling Heights' FROM companies WHERE slug = 'town-and-country-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Royal Oak' FROM companies WHERE slug = 'town-and-country-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Southfield' FROM companies WHERE slug = 'town-and-country-door';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'tri-county-doors-fremont',
  'Tri County Doors',
  0.0, 0, 'Fremont, MI', 'fremont',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'Tri County Doors provides garage door installation and service/repair in Fremont, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '276-265-0408', NULL,
  '4242 S Ferris Ave, Fremont, MI 49412-8775', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-3-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'tri-county-doors-fremont';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'tri-county-doors-fremont';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'tri-county-doors-fremont';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'tri-county-doors-fremont';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'tri-county-doors-fremont';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Fremont' FROM companies WHERE slug = 'tri-county-doors-fremont';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'tri-city-door-service',
  'Tri-City Door Service',
  4.8, 54, 'Bay City, MI', 'bay-city',
  '["Repair", "Springs", "Emergency"]',
  0, 1,
  'Tri-City Door Service covers Bay City, Saginaw, and Midland with residential spring repair and emergency garage door service.',
  'Mon–Sat, 7am–7pm', 'Same-day when available', NULL, NULL,
  NULL, NULL,
  NULL, NULL, NULL, NULL, NULL,
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'tri-city-door-service';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'tri-city-door-service';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'tri-city-door-service';
INSERT INTO company_services (company_id, service) SELECT id, 'Emergency Service' FROM companies WHERE slug = 'tri-city-door-service';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Bay City' FROM companies WHERE slug = 'tri-city-door-service';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Saginaw' FROM companies WHERE slug = 'tri-city-door-service';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Midland' FROM companies WHERE slug = 'tri-city-door-service';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Essexville' FROM companies WHERE slug = 'tri-city-door-service';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'tri-city-overhead-doors-menominee',
  'Tri-City Overhead Doors',
  4.8, 43, 'Menominee, MI', 'menominee',
  '["Repair", "Installation"]',
  0, 0,
  'Tri-City Overhead Doors provides garage door installation and service/repair in Menominee, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '920-471-7172', NULL,
  NULL, NULL,
  'https://www.google.com/maps/search/?api=1&query=Tri-City+Overhead+Doors+Menominee+Michigan', 'Current Business Index', 'High', 'Upper Peninsula', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'tri-city-overhead-doors-menominee';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'tri-city-overhead-doors-menominee';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'tri-city-overhead-doors-menominee';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'tri-city-overhead-doors-menominee';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'tri-city-overhead-doors-menominee';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Menominee' FROM companies WHERE slug = 'tri-city-overhead-doors-menominee';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Marquette' FROM companies WHERE slug = 'tri-city-overhead-doors-menominee';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'up-garage-door-service',
  'U.P. Garage Door Service',
  4.8, 28, 'Marquette, MI', 'marquette',
  '["Repair", "Installation", "Openers"]',
  0, 0,
  'U.P. Garage Door Service serves Marquette and the central Upper Peninsula with residential garage door repair and installation.',
  'Mon–Fri, 8am–5pm', NULL, NULL, NULL,
  NULL, NULL,
  NULL, NULL, NULL, NULL, NULL,
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'up-garage-door-service';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'up-garage-door-service';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'up-garage-door-service';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'up-garage-door-service';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'up-garage-door-service';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Marquette' FROM companies WHERE slug = 'up-garage-door-service';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Ishpeming' FROM companies WHERE slug = 'up-garage-door-service';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Negaunee' FROM companies WHERE slug = 'up-garage-door-service';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Gwinn' FROM companies WHERE slug = 'up-garage-door-service';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'up-and-down-door-co-ann-arbor',
  'Up and Down Door Co',
  5.0, 13, 'Ann Arbor, MI', 'ann-arbor',
  '["Repair", "Installation"]',
  0, 0,
  'Up and Down Door Co provides garage door installation and service/repair in Ann Arbor, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '734-419-3777', NULL,
  '3588 Plymouth Rd, Ann Arbor, MI 48105', NULL,
  'https://www.google.com/maps/search/?api=1&query=Up+And+Down+Door+Co+3588+Plymouth+Rd%2C+Ann+Arbor%2C+MI+48105+Michigan', 'Current Business Index', 'High', 'Ann Arbor / Livingston', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'up-and-down-door-co-ann-arbor';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'up-and-down-door-co-ann-arbor';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'up-and-down-door-co-ann-arbor';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'up-and-down-door-co-ann-arbor';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'up-and-down-door-co-ann-arbor';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Ann Arbor' FROM companies WHERE slug = 'up-and-down-door-co-ann-arbor';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Ypsilanti' FROM companies WHERE slug = 'up-and-down-door-co-ann-arbor';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Brighton' FROM companies WHERE slug = 'up-and-down-door-co-ann-arbor';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Howell' FROM companies WHERE slug = 'up-and-down-door-co-ann-arbor';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'wayne-county-garage-door',
  'Wayne County Garage Door',
  4.6, 63, 'Livonia, MI', 'livonia',
  '["Repair", "Installation", "Openers"]',
  0, 0,
  'Wayne County Garage Door serves Livonia, Canton, Westland, and western Wayne County with residential repair and installation.',
  'Mon–Fri, 8am–6pm', NULL, NULL, NULL,
  NULL, NULL,
  NULL, NULL, NULL, NULL, NULL,
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'wayne-county-garage-door';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'wayne-county-garage-door';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'wayne-county-garage-door';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'wayne-county-garage-door';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'wayne-county-garage-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Livonia' FROM companies WHERE slug = 'wayne-county-garage-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Canton' FROM companies WHERE slug = 'wayne-county-garage-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Westland' FROM companies WHERE slug = 'wayne-county-garage-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Plymouth' FROM companies WHERE slug = 'wayne-county-garage-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Dearborn' FROM companies WHERE slug = 'wayne-county-garage-door';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Garden City' FROM companies WHERE slug = 'wayne-county-garage-door';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'west-metro-door-window-inc-taylor',
  'West Metro Door & Window Inc',
  0.0, 0, 'Taylor, MI', 'taylor',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'West Metro Door & Window Inc provides garage door installation and service/repair in Taylor, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '313-291-6005', NULL,
  '25220 Northline Rd, Taylor, MI 48180', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-3-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'west-metro-door-window-inc-taylor';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'west-metro-door-window-inc-taylor';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'west-metro-door-window-inc-taylor';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'west-metro-door-window-inc-taylor';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'west-metro-door-window-inc-taylor';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Taylor' FROM companies WHERE slug = 'west-metro-door-window-inc-taylor';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'west-michigan-door-co',
  'West Michigan Door Co',
  4.4, 41, 'Walker, MI', 'walker',
  '["Repair", "Installation", "Commercial"]',
  0, 0,
  'West Michigan Door Co serves Walker and the northwest Grand Rapids suburbs with residential and light commercial garage door service.',
  'Mon–Fri, 8am–5pm', NULL, NULL, NULL,
  NULL, NULL,
  NULL, NULL, NULL, NULL, NULL,
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'west-michigan-door-co';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'west-michigan-door-co';
INSERT INTO company_services (company_id, service) SELECT id, 'Commercial Service' FROM companies WHERE slug = 'west-michigan-door-co';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'west-michigan-door-co';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'west-michigan-door-co';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Walker' FROM companies WHERE slug = 'west-michigan-door-co';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Grand Rapids' FROM companies WHERE slug = 'west-michigan-door-co';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Comstock Park' FROM companies WHERE slug = 'west-michigan-door-co';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'white-s-garage-door-north-branch',
  'White''s Garage Door',
  5.0, 406, 'North Branch, MI', 'north-branch',
  '["Repair", "Installation"]',
  0, 0,
  'White''s Garage Door provides garage door installation and service/repair in North Branch, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '810-688-3655', NULL,
  '7158 McTaggart Rd, North Branch, MI 48461', NULL,
  'https://www.google.com/maps/search/?api=1&query=White%27s+Garage+Door+7158+McTaggart+Rd%2C+North+Branch%2C+MI+48461+Michigan', 'Current Business Index', 'High', 'Flint / Genesee / Lapeer', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'white-s-garage-door-north-branch';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'white-s-garage-door-north-branch';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'white-s-garage-door-north-branch';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'white-s-garage-door-north-branch';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'white-s-garage-door-north-branch';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'North Branch' FROM companies WHERE slug = 'white-s-garage-door-north-branch';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Flint' FROM companies WHERE slug = 'white-s-garage-door-north-branch';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Grand Blanc' FROM companies WHERE slug = 'white-s-garage-door-north-branch';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Fenton' FROM companies WHERE slug = 'white-s-garage-door-north-branch';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'wieber-lumber-co-fowler',
  'Wieber Lumber Co',
  0.0, 0, 'Fowler, MI', 'fowler',
  '["Repair", "Installation", "Clopay Dealer"]',
  0, 0,
  'Wieber Lumber Co provides garage door installation and service/repair in Fowler, Michigan. Listed as a Clopay authorized dealer — Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs, and preventive maintenance.',
  'Call for hours', NULL, '989-593-2280', NULL,
  '132 N Main Street, PO Box 20, Fowler, MI 48835-5124', NULL,
  'https://www.clopaydoor.com/dealers/michigan/-page-3-', 'Clopay Authorized Dealer', 'High', 'Statewide / Clopay', 'Clopay states its Michigan dealers provide new-door installation, time-sensitive repairs and preventive maintenance.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'wieber-lumber-co-fowler';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'wieber-lumber-co-fowler';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'wieber-lumber-co-fowler';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'wieber-lumber-co-fowler';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'wieber-lumber-co-fowler';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Fowler' FROM companies WHERE slug = 'wieber-lumber-co-fowler';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'wolverine-door-service-marquette',
  'Wolverine Door Service',
  4.0, 24, 'Marquette, MI', 'marquette',
  '["Repair", "Installation"]',
  0, 0,
  'Wolverine Door Service provides garage door installation and service/repair in Marquette, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '906-249-3179', NULL,
  '2210 US-41 S, Marquette, MI 49855', NULL,
  'https://www.google.com/maps/search/?api=1&query=Wolverine+Door+Service+2210+US-41+S%2C+Marquette%2C+MI+49855+Michigan', 'Current Business Index', 'High', 'Upper Peninsula', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'wolverine-door-service-marquette';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'wolverine-door-service-marquette';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'wolverine-door-service-marquette';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'wolverine-door-service-marquette';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'wolverine-door-service-marquette';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Marquette' FROM companies WHERE slug = 'wolverine-door-service-marquette';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, phone_alt, address, website,
  source_url, source_type, confidence, region, notes, on_platform, claimed
) VALUES (
  'zeeland-garage-door-zeeland',
  'Zeeland Garage Door',
  4.7, 13, 'Zeeland, MI', 'zeeland',
  '["Repair", "Installation"]',
  0, 0,
  'Zeeland Garage Door provides garage door installation and service/repair in Zeeland, Michigan. Current 2026 business-index result explicitly describes repair and installation capability.',
  'Call for hours', NULL, '616-218-8364', NULL,
  '7622 Bohl Rd, Zeeland, MI 49464', NULL,
  'https://www.google.com/maps/search/?api=1&query=Zeeland+Garage+Door+7622+Bohl+Rd%2C+Zeeland%2C+MI+49464+Michigan', 'Current Business Index', 'High', 'Muskegon / Lakeshore', 'Current 2026 business-index result explicitly describes repair and installation capability.',
  'Since 2026', 0
);
INSERT INTO company_services (company_id, service) SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'zeeland-garage-door-zeeland';
INSERT INTO company_services (company_id, service) SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'zeeland-garage-door-zeeland';
INSERT INTO company_services (company_id, service) SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'zeeland-garage-door-zeeland';
INSERT INTO company_services (company_id, service) SELECT id, 'New Door Installation' FROM companies WHERE slug = 'zeeland-garage-door-zeeland';
INSERT INTO company_services (company_id, service) SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'zeeland-garage-door-zeeland';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Zeeland' FROM companies WHERE slug = 'zeeland-garage-door-zeeland';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Muskegon' FROM companies WHERE slug = 'zeeland-garage-door-zeeland';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Norton Shores' FROM companies WHERE slug = 'zeeland-garage-door-zeeland';
INSERT INTO company_service_areas (company_id, area) SELECT id, 'Holland' FROM companies WHERE slug = 'zeeland-garage-door-zeeland';


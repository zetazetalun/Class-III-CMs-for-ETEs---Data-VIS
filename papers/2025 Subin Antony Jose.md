_Review_

# In-Space Manufacturing: Technologies, Challenges, and Future Horizons

## Subin Antony Jose, Jordan Jackson, Jayden Foster, Terrence Silva, Ethan Markham and Pradeep L. Menezes \*

Department of Mechanical Engineering, University of Nevada-Reno, Reno, NV 89557, USA; [subinj@unr.edu](mailto:subinj@unr.edu) (S.A.J.); [jejackson@unr.edu](mailto:jejackson@unr.edu) (J.J.); [jaydenf@unr.edu](mailto:jaydenf@unr.edu) (J.F.); [terrencesilva@unr.edu](mailto:terrencesilva@unr.edu) (T.S.); [ethanmarkham@unr.edu](mailto:ethanmarkham@unr.edu) (E.M.)

**\*** Correspondence: [pmenezes@unr.edu](mailto:pmenezes@unr.edu)

Academic Editor: Edouard Rivière-Lorphèvre

Received: 31 January 2025

Revised: 3 March 2025

Accepted: 4 March 2025

**Abstract:** In-space manufacturing represents a transformative frontier in space exploration and industrial production, offering the potential to revolutionize how goods are produced and resources are utilized beyond Earth. This paper explores the multifaceted aspects of in-space manufacturing, including its evolution, technologies, challenges, and future prospects, while also addressing ethical and legal dimensions critical to its development. Beginning with an overview of its significance and historical context, this paper underscores key concepts such as resource optimization and the reduction of launch costs. It examines terrestrial and space-based manufacturing processes, emphasizing additive manufacturing, advanced materials processing, autonomous robotic systems, and biomanufacturing for pharmaceuticals. Unique challenges posed by the space environment, such as microgravity, vacuum conditions, and radiation exposure, are analyzed alongside issues related to supply chains, quality assurance, and energy management. Drawing from case studies, including missions aboard the International Space Station, this paper evaluates the lessons learned over six decades of innovation in in-space manufacturing. It further explores the potential for large-scale production to support deep-space missions and assesses the commercial and economic feasibility of these technologies. This paper also delves into the policy, legal, and ethical considerations to address as space-based manufacturing becomes integral to future space exploration and the global space economy. Ultimately, this work provides a comprehensive roadmap for advancing in-space manufacturing technologies and integrating them into humanity’s pursuit of sustainable and scalable space exploration.

**Keywords:** in-space manufacturing; microgravity; additive manufacturing; robotic manufacturing; bio-manufacturing

Published: 5 March 2025

**Citation:** Antony Jose, S.; Jackson, J.;

Foster, J.; Silva, T.; Markham, E.; Menezes, P.L. In-Space Manufacturing: Technologies, Challenges, and Future Horizons. _J. Manuf. Mater. Process._

**2025**, _9_, 84. [https://doi.org/10.3390/](https://doi.org/10.3390/jmmp9030084)

[jmmp9030084](https://doi.org/10.3390/jmmp9030084)

**Copyright:** © 2025 by the authors. Licensee MDPI, Basel, Switzerland. This article is an open access article distributed under the terms and conditions of the Creative Commons Attribution (CC BY) license ([https://creativecommons.org/](https://creativecommons.org/licenses/by/4.0/) [licenses/by/4.0/](https://creativecommons.org/licenses/by/4.0/)).

# Introduction

In-space manufacturing (ISM) refers to the production and fabrication of components in environments beyond planetary surfaces, typically in microgravity or strong vacuum conditions \[[1](#_bookmark9)\]. Since the 1960s, ISM has progressed from early conceptual studies and Skylab experiments to advanced manufacturing on the ISS, where innovations like 3D printing and fiber optics production have showcased its ability to reduce launch mass, min-imize waste, and eliminate excess spare components \[[2](#_bookmark10),[3](#_bookmark11)\]. As space exploration ventures further from Earth, the logistical challenges and costs associated with resupply missions and repairs become increasingly prohibitive. Manufacturing materials and components directly in space offers significant advantages, including reduced launch mass, minimized waste, and elimination of excess spare components. The primary objective of ISM is to enable on-demand fabrication, repair, and recycling of components, optimizing resource

_J. Manuf. Mater. Process._ **2025**, _9_, 84 https://doi.org/10.3390/jmmp9030084

utilization and supporting sustainable exploration efforts. By reducing reliance on Earth-based supply chains, ISM could drastically lower mission costs and increase the flexibility of future space missions \[[4](#_bookmark12)\].

Advancements in ISM hold the potential to address critical challenges in space opera-tions, such as enhancing solar power generation, enabling high-data-rate communication, and improving logistics for spare parts \[[5](#_bookmark13)\]. For instance, the lowest complexity tasks, such as mating two independent spacecraft, lay the foundation for more sophisticated operations. Modular assembly, a more complex process, involves docking cabins or modules to create larger, multifunctional spacecraft. Over time, these tasks, once performed manually by as-tronauts, are being transitioned to fully autonomous robotic systems. Such systems require highly dexterous and reliable technologies to handle complex assembly tasks with minimal human intervention \[[6](#_bookmark14)\]. These advancements in automation will not only reduce the risk to human life but also enable longer-duration missions, where crewmembers are freed from routine assembly work to focus on scientific research and exploration. As technologies continue to evolve, the potential applications of ISM could expand, making it a cornerstone of future deep space missions and off-world settlements.

The overarching objectives of ISM include waste reduction, in-situ damage repair, and the construction of structures necessary for extended space exploration. These capabil-ities aim to reduce dependence on Earth-based resupply missions and human-machine interactions, which are often time-consuming, costly, and logistically complex \[[4](#_bookmark12),[7](#_bookmark15)\]. By utilizing local resources available in space, ISM reduces the need to launch materials from Earth, saving on both mass and fuel costs. Furthermore, in-space manufacturing reduces the amount of waste generated during missions, as materials can be reused or repurposed for new functions, thus contributing to a more sustainable approach to space exploration. Future advancements in this field could enable transformative possibilities such as

3D-printed repairs and assemblies, allowing for rapid on-demand production of spare parts, tools, or even structural components in space \[[8](#_bookmark16)\]. This would greatly enhance mission flexibility, enabling astronauts to make quick repairs or modifications to their spacecraft or habitats without waiting for resupply missions. The construction of spaceports and large-scale antennae for communication could also become feasible, allowing for the establishment of robust infrastructure to support deep-space exploration and commercial space activities \[[9](#_bookmark17)\]. These infrastructures would be built directly in space, reducing the need for Earth-based launches and enabling long-term sustainability in space environments.

The development of habitats for long-term missions, such as lunar bases or Martian colonies, could also be realized with ISM capabilities. These habitats would not only rely on in-space manufacturing for construction but could also incorporate recycling technologies, ensuring that resources are constantly replenished from the environment. In an even broader context, ISM could support the in-situ production of food and pharmaceuticals, enabling long-duration missions to sustain life without relying on Earth-based resupply. By addressing these objectives, ISM promises to redefine the future of space exploration, making it more sustainable, cost-effective, and independent from Earth-based resources. This shift could open the door to truly autonomous space exploration, where human presence is no longer constrained by logistical limitations and resources are continuously optimized for future missions \[[10](#_bookmark18)\].

# Technologies and Methods for ISM

- 1.  _Additive Manufacturing in Microgravity_

Additive manufacturing (AM), commonly known as 3D printing, has emerged as a critical technology for ISM, reducing the need to transport spare parts and tools from Earth. By enabling the production of components directly in space, it helps lower launch costs and

supports long-term missions. AM involves translating a 3D digital model into a physical object by building it layer by layer. In the microgravity environment of the low Earth orbit (LEO), AM can produce lightweight components with good mechanical strength and desirable material properties, although post-processing is often required \[[4](#_bookmark12),[11](#_bookmark19)\].

Despite following the same general steps to fabricate components, AM encompasses several distinct processes, summarized in Table [1](#_bookmark1) \[[12](#_bookmark20)–[15](#_bookmark21)\]. The most commonly employed technique, filament-based material extrusion, involves extruding filament through a nozzle under pressure. This method is simple, energy-efficient, and minimizes contamination risks during material changes. However, it primarily processes polymers, with metals, ceramics, and composites requiring indirect approaches \[[4](#_bookmark12)\]. Another prominent method, powder bed fusion, spreads a layer of powdered material and fuses it using a high-energy source, such as a laser or electron beam. This technique yields high-resolution dense components with robust mechanical properties but involves significant safety risks due to the toxicity and combustibility of metallic powders and intense thermal energy sources. Directed energy deposition utilizes focused thermal energy to deposit and fuse materials, enabling the creation of alloy parts. Vat photopolymerization, meanwhile, employs light-activated polymerization to selectively cure liquid photopolymers, offering precise control over part geometry. Material jetting deposits electrostatically charged droplets through a deflection field, often using waxy polymers, acrylate photopolymers, or nanoparticle-laden colloids. Two other processes, binder jetting and sheet lamination, remain largely unexplored in microgravity conditions. These methods involve depositing liquid binders onto powdered materials, or bonding material layers using adhesives, welding, or heat, respectively \[[16](#_bookmark22)\].

**Table 1.** Additive manufacturing processes and challenges.

## Process General Description Challenges

Filament-based material extrusion

Extrudes filament through a nozzle under pressure

Limited to direct polymer processing

Fuses powder layers using a high-energy source

Powder Bed Fusion

Safety hazards from high-energy sources and metallic powders

Directed Energy Deposition

Deposits and fuses materials using thermal energy

Limited control over material during deposition

Vat Photopolymerization Cures liquid photopolymers

with light

Deposits charged droplets through a deflection field

Material Jetting

Deposits liquid binder onto powdered material

Binder Jetting

Sheet Lamination Bonds layers via adhesive,

welding, or heat

Requires specialized photopolymer materials

Limited material variety and processing challenges

Unproven in microgravity Unproven in microgravity

Microgravity introduces unique challenges to AM processes. For instance, liquid-based filaments can levitate in microgravity, complicating material handling, though tech-niques such as electron beam freeform fabrication help mitigate this issue \[[11](#_bookmark19)\]. Variations in temperature and heat flow also impact the adhesion of materials to the printer base. While microgravity does not inherently alter material structures, subtle changes to process settings can result in deformities \[[17](#_bookmark23)\]. Figure [1](#_bookmark2) shows the structure–process–property–performance paradigm of material science and material science in the space environment. Currently, 3D printing in space is primarily used for prototyping and producing backup tools and components, rather than mass production. Further advancements are required to

scale these processes and fully realize the potential of AM in supporting long-term space exploration missions.

**Figure 1.** Structure–process–property–performance paradigm of (**a**) material science, and (**b**) adapted for material science in space. Reproduced with permission from \[[18](#_bookmark24)\].

Equal manufacturing (EM), which includes processes such as forging, rolling, and extrusion, is categorized as the shaping of materials without the addition or removal of material mass. These methods can yield high-strength and dense materials while preserving material properties better than AM. EM can find application in space in manufacturing structural beams, pressure vessels, or other load-bearing components. However, the need for significant force application in microgravity presents a major engineering challenge, as traditional presses and rolling equipment require stable reaction forces that are difficult to achieve in orbit. Heat dissipation in a vacuum also complicates certain EM processes that rely on thermal treatments \[[19](#_bookmark25),[20](#_bookmark26)\].

Subtractive manufacturing (SM), which consists of processes like machining, milling, and grinding, removes material from a solid workpiece to achieve high precision and better surface finish. This method is well-suited for refining parts made through AM or EM, as well as repurposing or recycling existing materials. However, SM generates chips and dust that must be carefully contained in microgravity to prevent contamination of spacecraft systems. Additionally, traditional cooling and lubrication methods, which rely on fluids, are ineffective in a vacuum, leading to increased tool wear and thermal management challenges \[[21](#_bookmark27)–[23](#_bookmark28)\].

- 1.  _Advanced Materials and Their Processing in Space_

The materials we commonly use and understand have predominantly been studied within Earth’s environment. Their reactions to factors like temperature, pressure, and corrosion have been extensively explored in Earth’s atmosphere, but far less is known about how these materials behave in the unique conditions of outer space. As humanity ventures further into space exploration, advancing material science for space environments becomes essential \[[24](#_bookmark29)\].

One of the most relied-upon materials in space applications is titanium due to its combination of lightweight durability and resistance to corrosion. Titanium retains its mechanical properties even in the extremely low temperatures of space, making it a pre-ferred choice for spacecraft and structural components. Its performance is further enhanced when alloyed with other metals, improving strength and corrosion resistance \[[25](#_bookmark30)\]. Recent advancements in processing titanium alloys into powders and wires have significantly reduced manufacturing costs, especially for in-space applications, as these forms can be uti-lized in AM processes akin to 3D printing \[[26](#_bookmark31)\]. Spacecraft also require advanced lubricants

to ensure the functionality of moving parts. Traditional lubricants face significant chal-lenges in the harsh conditions of space, such as freezing temperatures and low gravity \[[27](#_bookmark32)\]. Researchers are addressing these issues by developing nanoscale-engineered lubricants with improved wear resistance and extended lifespans. These innovations are vital for sustaining long-term missions and reducing maintenance requirements \[[28](#_bookmark33)–[32](#_bookmark34)\]. Similarly, braking systems for space machinery and vehicles are being revolutionized. Metal-matrix composites are being developed to enhance toughness and reduce friction-induced degra-dation, allowing machinery and vehicles to operate efficiently over extended cycles. These advancements ensure the reliability and longevity of essential systems in the demanding environment of space \[[33](#_bookmark35)–[36](#_bookmark36)\]. Another breakthrough material is polyimides, which offer remarkable resistance to radiation and extreme temperatures, making them ideal for both space travel and atmospheric reentry. Polyimides are highly versatile, functioning as excel-lent insulators and protective coatings for electronics \[[37](#_bookmark37)\]. Their malleability makes them particularly suited for ISM, where adaptability and ease of use are critical \[[38](#_bookmark38)\]. The benefits of these various materials are shown in Table [2](#_bookmark3) below.

**Table 2.** Types of materials for ISM and their functionalities.

## Material Functionality Used in

- High strength-to-weight ratio Titanium Alloy - Excellent corrosion resistance
- Good temperature resistance
- High thermal stability

Polyimides - Excellent chemical resistance

- Low outgassing properties
- Combines high strength of

Structural components and aerospace parts

Insulation and protective coatings for electronic

Structural applications,

Metal Matrix Composites

metals with lightweight properties of composites

- Improved thermal and mechanical properties

thermal management, and high-performance components

These materials represent the forefront of space-based material science, providing solutions to the unique challenges posed by the extraterrestrial environment. With ongoing research and development, these advanced materials will be crucial in enabling sustainable and efficient space exploration and manufacturing.

- 1.  _Autonomous and Robotic Manufacturing Systems_

Autonomous and robotic manufacturing systems are revolutionizing the production of tools and parts for space applications. These advanced systems can fabricate components and assemble final products, enabling the creation of essential items such as spacecraft hardware, tools, solar power systems, and much more \[[8](#_bookmark16)\]. By leveraging these methods, large structures and systems can be manufactured directly in space, eliminating the need to transport oversized components that may exceed spacecraft capacity. This capability significantly supports long-term lunar exploration, missions to Mars, and deep space exploration \[[39](#_bookmark39)\].

Autonomous manufacturing systems can oversee the entire design and production process, including material selection, object design, manufacturing, and product testing. This comprehensive approach, traditionally requiring a full team of skilled personnel and machinery, can now be managed entirely by automated systems \[[40](#_bookmark40)\]. One notable example of this innovation is autonomous failure detection and correction in AM for in-space applications. Automated quality assessment systems, which utilize image processing and robotic arms, can monitor 3D printing processes in real-time. These systems identify and

rectify printing defects such as indentations, protrusions, and misaligned layers during production. Additionally, they can repair 3D-printed parts directly in space, reducing material waste and eliminating the need for costly return trips to Earth for repairs \[[41](#_bookmark41)\].

NASA’s Autonomous Reconfigurable Mission Adaptive Digital Assembly Systems (ARMADAS) exemplify the potential of robotic manufacturing in space. These small yet highly capable robots collaborate to assemble large structures, including antennas, habitat modules, and even entire spaceports. Despite their size, these robots operate with exceptional accuracy and precision without relying on extensive measuring systems. This enables the construction of large complex structures in orbit and on planetary surfaces, bypassing the challenges associated with transporting pre-built structures \[[15](#_bookmark21)\].

Advantages of autonomous and robotic manufacturing in space include the following:

(a) Efficiency: automating the entire manufacturing process reduces reliance on human intervention and resource-intensive transport from Earth. (b) Flexibility: systems can adapt to different design requirements and produce a variety of components on demand.

(c) Resource conservation: real-time defect correction and part repair minimize mate-rial waste. (d) Scalability: robots like ARMADAS facilitate the construction of massive structures in space, enabling ambitious projects such as spaceports and habitats. Au-tonomous and robotic systems are set to become indispensable in the future of space exploration and settlement, revolutionizing humanity’s capacity to innovate, adapt, and thrive beyond Earth.

- 1.  _Biomanufacturing and Pharmaceutical Production in Space_

Extended human habitation on extraterrestrial planets, such as Mars, faces numerous challenges, including ensuring human health, maintaining operational resilience, and man-aging costs. Biomanufacturing presents a promising solution by enabling the production of goods through In-Space Resource Utilization (ISRU). This involves recycling waste and creating a stable ecosystem to support biological processes, which can significantly reduce launch costs and resupply mission frequency \[[42](#_bookmark42)\].

The first successful demonstration of vegetation growth in space dates back to the 1950s. Today, advancements have allowed red romaine lettuce to be cultivated and safely consumed aboard the International Space Station (ISS). As technology progresses, research has expanded from basic solar and nutrient studies to producing high-value pharmaceutical products, a process known as Molecular Pharming \[[43](#_bookmark43)\]. For instance, based on the NASA report in 2012, sending food to the ISS costs around $30,000 per kg. Each astronaut consumes an average of 1.8 kg of food daily. It is to be mentioned that the weight of the food packages is not included in the mentioned cost \[[44](#_bookmark44),[45](#_bookmark45)\]. A Mars mission, projected to last three years round-trip, would require 10,000–11,000 kg of food \[[46](#_bookmark46)\]. These logistics underscore the importance of achieving self-sustaining ecosystems in space. Efforts to achieve this have been attempted, such as China’s Chang’e 4 lunar lander, which carried fruit fly eggs and plant seeds. Although the seeds germinated successfully, a failure in biosphere temperature control led to their demise. Unexpected challenges, such as elevated carbon dioxide levels on the ISS compared to Earth, highlight the complexity of growing vegetation in space \[[47](#_bookmark47)\].

The COVID-19 pandemic underscored the need for flexible and scalable produc-tion processes for biopharmaceuticals, particularly monoclonal antibodies (mAbs). These molecules, derived from mammalian cell lines, are highly specific and efficient in treating various diseases. Producing mAbs in space could revolutionize medical care for long-duration missions, offering a means to address medical emergencies or chronic conditions without resupply from Earth \[[48](#_bookmark48)\].

As mission durations increase, so does the risk of medical complications. Historical cases like Apollo 7, where all crew members developed viral respiratory infections, demon-strate the importance of proactive healthcare planning in space. Common health issues include headaches, insomnia, motion sickness, and musculoskeletal conditions. Advancing biomanufacturing capabilities to produce preventative and therapeutic medicines beyond Earth could mitigate these risks and ensure the health and performance of astronauts \[[49](#_bookmark49)\].

By overcoming these challenges, space-based biomanufacturing has the potential to support long-term human exploration, reduce mission costs, and improve astronauts’ quality of life, paving the way for sustainable interplanetary travel.

# Challenges in ISM

- 1.  _Technical Challenges: Microgravity, Vacuum, and Radiation_

The prospect of ISM is crucial for advancing human exploration and settlement beyond Earth. However, the unique environment of outer space introduces significant technical challenges that must be addressed for successful implementation.

Microgravity, where the gravitational forces are negligible, presents the first and most apparent challenge. On Earth, traditional manufacturing techniques are optimized for environments with consistent gravity. In microgravity, materials behave unpredictably, ne-cessitating a fundamental reengineering of manufacturing processes. For example, molten materials may not settle uniformly, and fluids tend to form spherical shapes, complicating operations like welding or 3D printing. Additionally, the storage and management of production waste become critical in microgravity. Floating microparticles, if not controlled, can travel great distances, posing risks to equipment, spacecraft systems, and human safety. The vacuum of space, characterized by the absence of atmospheric pressure and elements such as oxygen, creates opportunities and challenges. On the positive side, metals are less prone to oxidation, extending their longevity. However, the lack of pressure can lead to material instabilities. For instance, certain plastics may become brittle or shatter due to the absence of compressive forces. Moreover, standard manufacturing techniques designed for Earth’s atmosphere must be adapted to function efficiently in a vacuum. Processes such as casting or chemical reactions that rely on atmospheric interaction must be reevaluated and retooled \[[50](#_bookmark50)\].

Radiation, including solar and cosmic radiation, is a pervasive challenge in space, where Earth’s protective atmosphere and magnetic field are absent. Prolonged radiation exposure can degrade materials, weakening their structural integrity over time. Metals, polymers, and composites may experience embrittlement, and electronic systems can suffer from radiation-induced malfunctions. For machines and vehicles with moving parts, this accelerated degradation could lead to frequent failures, requiring constant repairs. Long-term space missions must account for these risks by developing radiation-resistant materials and ensuring adequate repair resources \[[51](#_bookmark51)\]. Additionally, radiation impacts extend beyond structural materials. Tools, products, and even habitats must be designed to withstand prolonged radiation exposure, ensuring the safety and functionality of space operations. These challenges are amplified when considering long-term habitation in space. Structures that support human life must be robust against material degradation, waste accumulation, and environmental hazards. Addressing these factors is critical for creating self-sustaining systems capable of supporting human life for extended durations. By overcoming these technical hurdles, ISM can unlock new possibilities for exploration, resource utilization, and establishing a permanent human presence beyond Earth.

- 1.  _Resource Constraints and Supply Chain Management_

ISM, which involves producing goods in outer space using materials either transported from Earth or sourced in situ, is becoming a cornerstone of future space exploration and colonization. However, significant challenges related to resource constraints and supply chain management must be addressed to ensure the long-term success and sustainability of space missions. These challenges not only raise costs but also pose critical risks, such as mission delays or failures in the event of supply chain disruptions \[[52](#_bookmark52)\]. Human survival and growth in space require robust infrastructure, including manufacturing capabilities, to support essential activities. Currently, these operations are primarily Earth-based, but the vision for “Space Infrastructure 2.0” includes designing and operating space factories to mitigate dependence on Earth-sourced materials and create self-sustaining systems in space \[[53](#_bookmark53)\].

Materials such as metals, energy sources, and water are not readily available in many extraterrestrial environments, adding complexity to ISM. Water, for instance, is indispensable for life support and numerous manufacturing processes, but its availability is limited across our solar system. While research into extracting resources from lunar regolith and mining asteroids has shown promise, these technologies remain in their infancy, presenting technical and logistical hurdles \[[54](#_bookmark54)\].

The harsh conditions of space, such as radiation, microgravity, and extreme temper-atures, complicate traditional manufacturing methods. AM has emerged as a promising solution for producing components in space, offering advantages like reduced weight, optimized design, and cost efficiency \[[55](#_bookmark55)\]. However, 3D printers require raw materials, which are currently sourced exclusively from Earth. Transporting these materials adds significant cost and logistical challenges, emphasizing the need for innovations in material sourcing and recycling in space \[[56](#_bookmark56)\].

Overcoming these challenges necessitates the development of advanced materials and manufacturing technologies that can operate efficiently under resource-scarce and extreme conditions. Techniques like in-situ resource utilization (ISRU) aim to leverage local resources, such as extracting metals from asteroids or water from lunar ice, to reduce dependence on Earth. Additionally, advancements in robotics, automation, and self-repairing systems are essential to optimize manufacturing processes and ensure reliability in space operations. By addressing resource constraints and reimagining supply chain management, ISM can pave the way for sustainable human activity beyond Earth, reducing reliance on terrestrial resources and enabling long-term exploration and habitation of space.

- 1.  _Quality Control and Standardization Issues_

ISM faces significant challenges stemming from the stringent rules and regulations of space travel. Every component and process must adhere to precise requirements, including rigorous quality control measures, inspections, strict material standards, tight tolerances, and meticulous surface finishes. These high standards are necessary to ensure that space technology can withstand extreme conditions while optimizing critical factors such as weight, reliability, and safety \[[57](#_bookmark57)\]. Key challenges specific to ISM include limited opportuni-ties for resupply, stringent tolerance requirements, potential material and part defects, and the need for designs that are both manufacturable and suited to the space environment \[[58](#_bookmark58)\]. The unique constraints of space demand an unprecedented level of precision and reliability to prevent catastrophic failures, which would be far more difficult to address in the absence of immediate terrestrial support.

AM is at the forefront of addressing these challenges. Research and development in this area aim to produce parts and components in space while meeting rigorous safety and quality standards. AM offers advantages such as reduced material waste, on-demand

production, and the ability to create complex geometries. However, ensuring the consis-tency and reliability of parts produced in space remains a major hurdle. Variables such as microgravity, radiation exposure, and limited resources add layers of complexity to maintaining quality control.

The implications of inadequate quality control in ISM extend beyond operational inefficiencies; they can jeopardize the safety of crew members, compromise mission success, and hinder the broader advancement of space exploration. For example, a defective part or substandard material could lead to the failure of critical systems, posing risks to human life and the mission’s objectives. To address these issues, robust standardization frameworks must be developed specifically for space-based manufacturing. These frameworks should incorporate innovative approaches to real-time inspection, defect detection, and adaptive quality control processes. Automated systems, machine learning algorithms, and sensor-based monitoring could play pivotal roles in maintaining high standards in the challenging conditions of space. By proactively tackling quality control and standardization issues, ISM can achieve the reliability and efficiency necessary to support the next generation of space missions. This progress is essential not only for the sustainability of in-space operations but also for unlocking the full potential of human exploration and habitation beyond Earth.

- 1.  _Energy Requirements and Thermal Management_

ISM faces significant challenges related to energy requirements and thermal man-agement, both of which are critical for the successful operation of satellites, space sta-tions, and manufacturing processes in orbit. Maintaining essential satellite functions, such as life support and communication systems, while powering AM processes presents unique constraints.

The primary energy source for most satellites and space stations is solar power, har-nessed through solar arrays and cells. Solar energy is then stored in batteries to ensure continuous power supply, including when the satellite is out of direct sunlight due to its orbit around Earth. While solar energy is cost-efficient, it comes with limitations. These include finite periods of sunlight, strict mass constraints on solar arrays, and the increasing energy demands of advanced AM systems. Efforts to overcome these constraints have focused on improving solar cell efficiency and reducing their mass \[[59](#_bookmark59)\]. Despite these advancements, the energy requirements for ISM processes can vary significantly, from a few hundred watts to several hundred kilowatts, depending on the type of manufac-turing. For example, laser-based AM techniques require considerably more power than non-laser-based methods \[[4](#_bookmark12)\].

To address these energy challenges, complementary power solutions such as nuclear and hydrogen-based systems are being explored \[[60](#_bookmark60)\]. While these alternatives can provide reliable backup power and help meet higher energy demands, they also introduce potential challenges, such as increased mass and complexity in satellite design. Balancing these trade-offs is crucial for ensuring uninterrupted operation and manufacturing capabilities. Thermal management is another critical issue in ISM. The space environment lacks convective heat transfer, meaning heat dissipation relies solely on conduction and radiation. This limitation significantly strains cooling systems, increasing the risk of overheating and temperature fluctuations. Inefficient heat management can lead to device malfunctions or long-term degradation of manufactured products \[[61](#_bookmark61)\]. Additionally, microgravity compli-cates thermal management during manufacturing processes. Uneven heat distribution can affect material solidification, leading to defects in the mechanical properties of the final product \[[62](#_bookmark62)\]. For example, extreme temperature variations in space can cause materials to

warp, expand, or contract, compromising their structural integrity \[[63](#_bookmark63)\].

To mitigate these challenges, advanced thermal management systems are being de-veloped. These systems leverage innovative materials and technologies to enhance heat dissipation while minimizing energy consumption. For instance, integrating phase-change materials or employing high-efficiency radiative cooling systems can help regulate temper-atures during manufacturing. Furthermore, research into the thermal behavior of materials in microgravity is essential for designing manufacturing processes that minimize defects. Optimizing energy use and thermal control in tandem will be pivotal for ensuring the reliability and efficiency of ISM systems, paving the way for sustained human activity and exploration in space.

# Benefits of ISM

ISM offers numerous advantages that enhance the efficiency, sustainability, and fea-sibility of long-term space exploration and habitation. The benefits include reduction in cost, resource utilization, added flexibility of missions, etc. ISM significantly decreases the need to launch fully assembled structures and spare parts from Earth. This enables the reduction in payload mass and eventual lowering of launch cost. By manufacturing parts and components in space, the very high expense associated with the heavy payload can be minimized, and the capacity of the launch vehicle can be improved \[[5](#_bookmark13)\].

Another key advantage of ISM lies in the manufacturing capability of components on-demand. Rather than relying on pre-supplied spare parts, ISM allows the astronauts to manufacture tools, replacement components, and structural parts as needed. This enhances the reduction of downtime due to equipment failure. A key objective of ISM is the reuse and recycling of materials, which enables the minimization of waste and promotes sustainability. This reduces the dependency on Earth-based resupply missions. Technologies like in-situ resource utilization (ISRU) can leverage lunar regolith, Martian soil, or even space debris to create useful materials, promoting sustainability in space exploration \[[64](#_bookmark64),[65](#_bookmark65)\].

The microgravity environment in space offers unique conditions for manufacturing advanced materials that are difficult or impossible to produce on Earth. Without gravita-tional forces interfering with atomic and molecular arrangements, certain materials can be fabricated with improved structural integrity, enhanced purity, and superior performance characteristics. ZBLAN (Zirconium Barium Lanthanide Aluminum Sodium Fluoride) is a type of fluoride-based optical fiber that has the potential to outperform traditional silica fibers in data transmission. On Earth, gravity-driven imperfections form during production, reducing efficiency. However, experiments aboard the International Space Station (ISS) have shown that ZBLAN fibers manufactured in microgravity have significantly fewer defects, resulting in lower signal loss and higher data transmission capabilities \[[66](#_bookmark66),[67](#_bookmark67)\].

# Current Developments and Case Studies

- 1.  _Notable ISM Missions and Experiments_

As technology continues to advance, a growing number of innovative experiments and missions are being conducted to push the boundaries of ISM. These efforts aim to enhance the accessibility and reliability of space travel while developing cutting-edge manufacturing techniques. Highlighted below are some notable missions and experiments driving ISM advancements.

1.  Flawless Photonics focuses on producing high-quality optical glass products, such as optical fibers, in microgravity environments. On Earth, the presence of gravity introduces defects during glass manufacturing. By relocating production to space, these gravitational effects are eliminated, leading to higher-quality optical fibers with fewer defects. Additionally, space-based manufacturing processes have demonstrated potential for increased production quantities. These advancements are not only

improving product quality but are also paving the way for the commercialization of optical fibers produced in space \[[68](#_bookmark68)\].

1.  California-based private company Varda specializes in manufacturing pharmaceu-ticals in space. One of their groundbreaking advancements involves developing single-use manufacturing satellites equipped with onboard reentry capsules. Collabo-rating with Rocket Lab, Varda launched their first test satellite in June 2024. These automated manufacturing satellites aim to revolutionize pharmaceutical production, leveraging microgravity to create better formulations and more effective drugs \[[69](#_bookmark69)\].
2.  NASA’s Materials International Space Station Experiment (MISSE) series focuses on understanding how materials and devices perform in low Earth orbit (LEO) envi-ronments. Since its inception, nearly 10 missions have been conducted (given in Table [3](#_bookmark4)), each testing the durability and performance of various materials under space conditions. Early missions utilized suitcase-sized Passive Experiment Containers to expose materials, including metals, coatings, optical components, and polymers, to LEO for extended periods. Later missions expanded to larger-scale exposure exper-iments, testing advanced materials such as smart materials, nanocomposites, and photovoltaic materials. MISSE’s findings provide invaluable insights for developing materials optimized for space applications \[[70](#_bookmark70)\].

**Table 3.** MISSEE mission list \[[70](#_bookmark70)\].

## MISSE Mission Launch Date Materials Tested Mission Description

MISSE 5 September 2006

MISSE 6 September 2007

MISSE 7 November 2009

MISSE 8 July 2011

sensors

Liquid crystal polymers, and advanced alloys

Advanced composites, adhesives, and thermal films

RFID tags, shape memory alloys, and paints

Photovoltaic materials, and nanocomposites

and thermal management

Exploring materials for structural and electrical uses

|     |     |     |
| --- | --- | --- |
| MISSE 1 & 2 | August 2001 | Metals, coatings, Testing material optical materials, and durability in LEO polymers |
| MISSE 3 & 4 | August 2006 | Solar cells, thermal Improving<br><br>control coatings, and space-grade solar cells |

Testing lightweight structures and insulation materials

Developing spacecraft identification and functionality materials

Evaluating energy generation and nanocomposite materials

Smart materials and advanced alloys

MISSE 9 June 2021

Testing intelligent materials and alloys for space applications

1.  NASA’s research into plant–microbe interactions explores the potential for microbes to enhance plant growth in microgravity. Specifically, the experiments focus on the interaction between tomato plants and Trichoderma harzianum, a microbe that improves stress resilience and seedling development. These studies aim to optimize

food production both in space and on Earth, ensuring reliable sources of fresh produce during long-term missions \[[71](#_bookmark71)\].

Each of these ISM missions and experiments represents a step forward in creating sustainable processes for space manufacturing and exploration. From improving optical fiber production and pharmaceuticals to advancing materials research and food growth, these initiatives are essential for achieving the long-term goals of space exploration and enhancing manufacturing capabilities both in orbit and on Earth \[[72](#_bookmark72)\].

- 1.  _Success Stories from the International Space Station_

The ISS has been a proving ground for numerous advancements in ISM, showcas-ing innovative technologies that address the unique challenges of microgravity. Below are some notable success stories that highlight the potential of ISM to revolutionize manufacturing processes.

In November 2014, the ISS became home to the first 3D printer ever deployed in space, designed to evaluate the effects of microgravity on parts manufactured through AM \[[73](#_bookmark73)\]. The mission was conducted in two phases, with each phase providing valuable insights into the behavior of materials in space. During the first phase, parts manufactured in microgravity were found to be stronger, stiffer, and denser compared to their Earth-made counterparts. However, the space-printed parts exhibited weaker compressive strength due to uneven material distribution, likely caused by microgravity’s lack of settling forces. Additionally, the bottom edges of these parts showed more pronounced protrusions, and the density was concentrated in the bottom layers. These anomalies were attributed to the nozzle’s proximity to the printing bed and insufficient heat dissipation in the thermal components. In the second phase, adjustments to the process settings significantly minimized these effects. Parts printed during this phase showed little to no evidence of microgravity-induced changes to their internal structure, highlighting the adaptability of 3D printing processes in space and their potential for creating reliable high-performance components \[[74](#_bookmark74)\].

Another major breakthrough on the ISS involved the production of fiber optics using heavy metal fluoride glasses. These glasses have been sought after for their exceptional optical properties, but their instability and susceptibility to crystallization have limited their manufacturing on Earth due to low viscosity at drawing temperatures. On Earth, the rapid crystallization of fluoride glasses during fiber drawing often leads to light-scattering losses, compromising the quality of the optical signal. However, in the microgravity envi-ronment of space, these effects are significantly reduced. Without gravity-induced forces, crystallite formation is minimized, allowing for a more stable and controlled manufacturing process \[[75](#_bookmark75)\]. This discovery demonstrates that producing fluoride glass fibers in space can produce higher-quality optical materials, making it a safer and more cost-effective approach for advancing fiber optic technology.

Resource limitations pose a significant challenge for manufacturing in space. Every kilogram of material launched into orbit adds to the cost and complexity of missions. To address this issue, the ISS installed the Refabricator in 2018, a groundbreaking device that combines 3D printing and recycling capabilities \[[76](#_bookmark76)\]. The Refabricator enables astronauts to recycle used 3D-printed parts into feedstock for new manufacturing projects. This closed-loop system reduces the need to transport additional feedstock into space and minimizes the reliance on pre-manufactured spare parts, 95% of which typically remain unused in orbit \[[73](#_bookmark73)\]. By repurposing old materials, the Refabricator not only optimizes resource utilization but also reduces waste, making it a critical step toward sustainable manufacturing in space.

These success stories from the ISS underscore the transformative potential of ISM. From refining 3D printing processes to advancing fiber optic manufacturing and creating innovative recycling solutions, these advancements pave the way for a more sustainable and efficient approach to manufacturing in space. Each development brings humanity closer to realizing the full potential of space exploration and off-world industrialization.

- 1.  _Emerging Technologies and Innovations in the Pipeline_

Space exploration has witnessed a surge in interest and advancements over the past few decades, driving the development of innovative ISM technologies. These advancements aim to increase mission flexibility, reduce costs, and extend human presence in space. As a leading entity in space exploration, NASA has played a pivotal role in developing and testing ISM technologies, using the ISS as a critical platform for experimentation and innovation \[[77](#_bookmark77)\]. One significant advancement in ISM involves sourcing materials from space itself, a concept known as In-Space Resource Utilization (ISRU). By leveraging lunar regolith and asteroids as resources, ISRU reduces the logistical challenges and costs associated with transporting materials from Earth. Current ISRU applications focus on extracting metals, water, and oxygen from extraterrestrial environments, which could be used for constructing facilities and producing fuel in space. Such advancements reduce dependence on Earth-sourced materials and pave the way for sustainable space operations. NASA’s Artemis program, targeting human exploration of the Moon by 2025, is a testament to this vision. By facilitating human activities on the lunar surface, the program aims to unlock further exploration of lunar resources and environments, laying the groundwork for future space endeavors \[[64](#_bookmark64),[78](#_bookmark78)\].

The Archinaut project exemplifies the potential of ISM innovations. In 2019, NASA partnered with “Made in Space” to develop the Archinaut One spacecraft, a robotic system capable of manufacturing and assembling parts in Earth’s orbit. This groundbreaking mission demonstrated the use of AM to build structures without the size constraints imposed by Earth-based launches. Archinaut One’s capabilities open new possibilities for creating larger space structures, including telescopes, satellite antennas, and solar arrays, marking a significant leap in space exploration technology \[[79](#_bookmark79)\].

Another promising initiative is the Redwire Regolith Print (RRP) project, a collabora-tion between NASA, the ISS, and Redwire Space. This project explores 3D printing with materials derived from lunar and Martian regolith to construct structures in space. Success in this endeavor could enable the construction of habitats and other facilities directly on the Moon and Mars, utilizing readily available extraterrestrial materials \[[80](#_bookmark80)\].

While most ISM innovations focus on low-risk incremental advancements, some disruptive concepts, such as the space elevator, highlight the ambitious nature of space exploration. The space elevator envisioned as an alternative to rocket transportation, re-mains a conceptual breakthrough but faces significant material and engineering challenges. The elevator’s cable must withstand extreme stresses and strains, compounded by solar wind and the gravitational interplay of the Earth, Moon, and Sun. Current materials lack the required tensile strength and rigidity to handle these demands. For instance, Table [4](#_bookmark5) compares potential materials for the elevator cable:

Among these materials, carbon nanotubes exhibit the highest tensile strength and characteristic length, making them a promising candidate for future exploration, though practical application remains elusive due to current limitations in manufacturing and material stability. As space exploration continues to evolve, emerging technologies such as ISRU, robotic manufacturing systems like Archinaut One, and material advancements for space structures demonstrate the exciting potential of ISM. While challenges remain,

these innovations steadily transform the possibilities of sustainable human presence and industrial activities beyond Earth.

**Table 4.** Elevator cable material properties \[[81](#_bookmark81)\].

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| **Material Density (_ρ_) Max Tensile** |     |     | **Characteristic Length (_L<sub>a</sub>_)** | **Taper Ratio** |
|     |     | **(GPa)** | **(Km)** |     |
| Steel | 7900 | 5.0 | 65  | 1.6 _×_ 1023 |
| Kevlar | 1440 | 3.6 | 255 | 2.5 _×_ 108 |
| Carbon 1300 |     | 130 | 10,200 | 1.6 |

## (Kg/m3)

**Stress (_σ_)**

Nanotubes

- 1.  _Comparative Analysis of ISM Approaches_

As ISM grows increasingly vital to humanity’s future, so does the necessity to develop efficient mass-manufacturing methods suited to the unique challenges of space. Unlike Earth, space presents an environment of microgravity, limited resources, and exposure to extreme conditions, necessitating innovative solutions. Among the various approaches, AM and Direct Robotic Extrusion of Photopolymers (DREPP) stand out as promising technologies with distinct advantages and limitations.

AM, often synonymous with 3D printing, has emerged as a primary method for ISM, leveraging its ability to build structures layer by layer. This approach was previously discussed (Section [2.1](#_bookmark0)) as highly adaptable for creating or repairing components in space. Its layer-by-layer construction is particularly well-suited for microgravity, where precise incremental assembly is advantageous. However, AM’s utility is limited by the size of the structures it can produce. While invaluable for fabricating small tools and parts and conducting repair work, it struggles with scalability for larger or more complex structures. Despite this limitation, its ability to build upon existing structures with minimal waste makes it an essential tool for space operations \[[59](#_bookmark59)\].

DREPP represents a novel ISM technique designed to address some of the constraints of traditional AM. In this method, a pump extrudes a UV-curable resin, which solidifies when exposed to UV light. The abundance of UV light in space offers a natural curing environment, though it can also be supplemented with directed UV lasers for precision. The resin used in DREPP can be reinforced with microstructures, such as glass strands, to enhance mechanical properties like strength and durability. The schematic representation of the DREPP experimental setup is given in Figure [2](#_bookmark6). Unlike AM, which constructs objects layer by layer, DREPP operates in 3D space, allowing for the creation of intricate structures part by part. This flexibility positions DREPP as a versatile tool for more complex manufacturing tasks, though it still shares similarities with traditional 3D printing techniques \[[82](#_bookmark82)\].

Both AM and DREPP offer significant advantages in the context of ISM, as described below.

1.  Material transport efficiency: The greatest logistical challenge of ISM lies in trans-porting materials out of Earth’s atmosphere. Traditional manufacturing materials are often bulky or heavy, complicating transport. In contrast, the materials used in AM and DREPP, such as liquefied resin, are lightweight and compact, making them easier to store and transport.
2.  Microgravity adaptability: The properties of liquefied resin in DREPP are particularly suited for microgravity. In space, resin naturally maintains cohesion, forming stable “globs” that can be cured with UV light. This behavior simplifies shaping and harden-

ing the material compared to Earth’s gravity, where external forces like gravity and air currents can cause deformation.

1.  Repair and maintenance applications: Both techniques excel in producing tools and components on demand, reducing the need to carry a comprehensive inventory of spare parts. This capability is critical for long-duration missions where resupply is infrequent or impossible.

**Figure 2.** DREPP schematic of the experimental setup. Reproduced with permission from \[[82](#_bookmark82)\].

While AM remains the more established technology, its scalability limitations hinder its application for large-scale construction. DREPP, on the other hand, offers greater flexibility for creating complex large structures but is still in its developmental stages and requires further optimization for widespread adoption. The following table (Table [5](#_bookmark7)) summarizes the comparative factors of AM and DREPP:

**Table 5.** Comparative factors of AM and DREPP \[[82](#_bookmark82),[83](#_bookmark83)\].

## Feature Additive Manufacturing

**(AM)**

**Direct Robotic Extrusion of Photopolymers (DREPP)**

Construction Method Layer-by-layer 3D spatial extrusion

Solid-state or powdered materials

Material

Application Small tools, repairs, simple

parts

Limited to

Scalability

small-to-medium parts

UV-curable resin

Complex structures and reinforced components

Potential for large-scale applications

Microgravity Suitability Moderate High

The development of AM and DREPP represents a critical step toward achieving sus-tainable ISM. While AM provides a reliable solution for small-scale production and repairs, DREPP offers a pathway to more complex and scalable manufacturing. Together, these technologies form the foundation for future innovations, enabling humanity’s expansion into the final frontier.

# Future Directions and Opportunities

- 1.  _Potential for Large-Scale Production in Space_

The prospect of large-scale production in space is rapidly transitioning from con-ceptual vision to tangible reality, with the potential to revolutionize multiple industries. Space-based manufacturing offers unique advantages over Earth-based production due to the microgravity environment, which enables the creation of materials and products with enhanced properties and precision. For instance, in the absence of gravitational forces, the production of high-precision materials such as semiconductors and pharmaceuticals can achieve greater consistency and fewer imperfections compared to terrestrial manufactur-ing \[[84](#_bookmark84)\]. This capability opens doors for breakthroughs in industries where even minor material defects can have significant consequences.

NASA’s Archinaut Project is a compelling example of the potential for large-scale manufacturing in orbit. As depicted in Figure [3](#_bookmark8), this initiative successfully demonstrated large-scale AM in a simulated space environment. The success of the Archinaut Project underscores the feasibility of scaling up manufacturing processes in orbit, with the ability to produce critical components and structures directly in space.

**Figure 3.** Rendering of the Archinaut Payload during In-Space Deployment. Credits: NASA \[[85](#_bookmark85)\].

NASA continues to pioneer innovative ISM technologies that push the boundaries of what can be manufactured in space. Some of the most promising advancements include:

(1) Bioprinting in microgravity: NASA is developing bioprinting technologies to fabricate cells and tissues in the microgravity environment of space. Compared to Earth-based production, tissue growth in space can occur more efficiently, paving the way for advanced biomedical research and applications, such as organ transplantation and regenerative medicine. (2) Flexible electronics and on-demand manufacturing: The development of flex-ible electronic devices and on-demand manufacturing techniques highlights the economic potential of ISM. These technologies enable the rapid production of intricate high-value components that would be too complex or cost-prohibitive to manufacture on Earth \[[85](#_bookmark85)–[87](#_bookmark86)\]. As ISM technologies continue to advance, the potential for large-scale produc-

tion in space becomes increasingly viable. Several areas stand to benefit significantly:

(a) Pharmaceuticals: the microgravity environment enables the creation of purer, more effective drug formulations. (b) Structures: space-based AM and robotic assembly could be used to fabricate large-scale structures, such as satellites or space habitats, directly in orbit.

(c) Advanced materials: microgravity allows for the production of materials with superior

properties, including alloys and composites. (d) Electronics: high-precision electronics with fewer defects can be manufactured in orbit, meeting the demands of cutting-edge technology industries \[[4](#_bookmark12)\].

The continued development of ISM technologies is transforming the vision of large-scale space manufacturing into an achievable reality. By leveraging the unique properties of the space environment, industries can overcome the limitations of terrestrial production and unlock unprecedented opportunities for innovation. From bioprinting and advanced electronics to high-precision materials and structural components, in-space production is poised to redefine the boundaries of manufacturing, driving the next era of industrial and technological progress.

- 1.  _ISM for Deep Space Exploration_

Deep space exploration focuses on studying space systems beyond the Earth–Moon system, with objectives that include understanding planetary formation, detecting potential extraterrestrial life, and gathering data to support future human settlements. Current mis-sions target planets like Mars, employing robotics to investigate planetary environments and assess their habitability \[[88](#_bookmark87)\]. Short-term goals include analyzing atmospheric composi-tions, planetary geology, and microbial life, contributing to a deeper understanding of the origins of the solar system and the possibility of life, past or present. These efforts align with the long-term vision of identifying planets, such as Mars, that could sustain human habitation \[[89](#_bookmark88)\].

One of the most significant challenges in deep space exploration is ensuring a reliable and efficient resource supply. Robotic missions often span several years to decades, while manned missions typically last no more than three years \[[90](#_bookmark89)\]. These extended durations require extensive planning and resource allocation, but launching materials from Earth is both expensive and prone to exceeding budgetary constraints.

ISM addresses these challenges by enabling the production of essential tools, compo-nents, and resources directly in space. By reducing the need to transport materials from Earth, ISM significantly lowers payload mass and associated launch costs. The ability to manufacture in a microgravity environment minimizes fuel consumption and overall production expenses \[[6](#_bookmark14)\]. ISM enhances mission flexibility and resilience by facilitating rapid responses to unforeseen challenges. For instance, if a critical component malfunctions, tools, and replacement parts can be produced on-site, eliminating the need to wait for resupply missions from Earth \[[91](#_bookmark90)\]. This capability is essential for maintaining mission efficiency and continuity in the unpredictable conditions of deep space.

ISM is instrumental in fostering self-sufficiency and extending the longevity of deep space missions. Long mission durations demand adaptable systems that can meet evolving needs. The ability to manufacture materials and tools in space allows for adjustments in mission focus and ensures operational efficiency. As humanity progresses toward poten-tially establishing extraterrestrial settlements, ISM will play a crucial role in constructing settlement infrastructures. Producing materials in microgravity enables the development of structures optimized for environments without Earth-like gravity, reducing dependency on Earth-based supplies and enhancing cost-effectiveness.

ISM is not just a tool for deep space exploration, it is a paradigm shift that redefines the feasibility and scope of such missions. By promoting self-reliance, reducing costs, and enhancing adaptability, ISM is poised to address the critical challenges of deep space exploration. As the dream of human settlements beyond Earth becomes more attainable, ISM will be the cornerstone of sustainable and efficient exploration, paving the way for humanity’s future among the stars.

- 1.  _Economic and Commercial Viability of Space-Based Production_

The global defense, space, and aerospace market is projected to exceed $13 billion by 2028 \[[72](#_bookmark72)\], signaling immense economic potential to reshape industries both on Earth and in space. Space-based production offers transformative advantages, including reducing the high costs associated with launching goods from Earth. The economic impact of in-space manufacturing (ISM) and AM is anticipated to manifest in key areas such as job creation, resource optimization, and the emergence of new markets.

The financial appeal of ISM has grown significantly, fueled by recent advancements such as reusable rockets, which have lowered launch costs by a factor of ten. These cost reductions make space manufacturing more accessible and spur further investments in orbital manufacturing infrastructure \[[92](#_bookmark91)\]. As competition among space industry players intensifies, innovation will drive down costs even further, creating a positive feedback loop that enhances return on investment and motivates additional companies to explore space-based production.

ISM is poised to generate a wave of employment opportunities, not only in space-related high-tech sectors but also in traditional industries on Earth. As demand rises for advanced materials, components, and technologies to support space operations, industries such as metalworking, chemical processing, and electronics manufacturing are expected to see indirect growth. Regions hosting spaceport infrastructure, maintenance hubs, and manufacturing facilities are likely to experience significant economic expansion \[[93](#_bookmark92)\]. More-over, the rise of ISM will drive the need for specialized expertise, stimulating growth in education and training programs focused on engineering, materials science, and advanced manufacturing. Developing a skilled workforce will be essential, as these roles require proficiency in cutting-edge technologies and interdisciplinary knowledge.

Despite its promise, ISM faces several hurdles. High initial investments, technological barriers, and logistical complexities present significant challenges. Regulatory uncertainty and international competition could also influence market dynamics. Nations striving to establish a competitive edge in space may create an uneven playing field, potentially leading to monopolies that restrict access to space-manufactured goods for less-developed countries \[[94](#_bookmark93)\].

While these challenges are substantial, the long-term prospects of space manufacturing are undeniably transformative. ISM has the potential to drive innovation, foster multina-tional cooperation, and create new markets. By addressing regulatory and technological barriers, the industry can unlock the full economic benefits of this new frontier, ensuring a more inclusive and sustainable approach to space-based production. As the vision of manufacturing in orbit becomes a reality, ISM will not only revolutionize the way we think about production but also pave the way for a future where space is an integral part of global economic systems.

- 1.  _Policy, Legal, and Ethical Considerations_

As humanity progresses toward establishing life and society beyond Earth, the im-plementation of manufacturing processes in these extraterrestrial settings presents a host of policy, legal, and ethical challenges. Manufacturing on Earth already entails complex regulatory and logistical considerations, and these challenges will intensify exponentially in the context of ISM.

Currently, most ISM experiments occur under international jurisdiction aboard the ISS, the only long-term controlled environment for in-space activities. This centralized governance contrasts sharply with the decentralized and region-specific policies governing manufacturing on Earth \[[95](#_bookmark94)\]. Moving forward, governments and international bodies must establish comprehensive frameworks to regulate ISM. Key policy considerations include:

(1) Funding and regulation: establishing clear policies on public and private funding for ISM initiatives and defining the scope of government oversight. (2) Global resource allocation: developing systems for equitable resource rights to prevent inequalities between nations. (3) Safety standards: formulating stringent safety protocols to mitigate risks associated with manufacturing in microgravity. These frameworks must strike a balance between encouraging innovation and safeguarding international cooperation, ensuring that ISM benefits all countries equitably.

The ethical implications of ISM are far-reaching, encompassing environmental, re-source exploitation, and labor concerns. They are as follows: (1) Environmental impact: Space is considered a shared resource for all humanity, but the extraction of materials from celestial bodies or the improper disposal of manufacturing byproducts could have dire consequences. Proper regulations must be in place to prevent environmental degradation in space. (2) Resource exploitation: the unchecked commercialization of space resources risks privatizing outer space, potentially exacerbating wealth inequality on Earth and any future space colonies. (3) Labor ethics: The unique conditions of space raise critical questions about labor rights. Would astronauts, engineers, and other space workers enjoy the same protections as those on Earth? New ethical standards tailored to space-specific conditions will be essential to ensure fair treatment and safety for all personnel \[[96](#_bookmark95)\].

The legal landscape for ISM is currently governed by a patchwork of international treaties, national laws, and agreements, with the Outer Space Treaty of 1967 serving as the foundational document. The treaty stipulates that space exploration must benefit all countries and prohibits national sovereignty claims over celestial bodies. However, it does not address the complexities of ISM, particularly for private sector activities \[[97](#_bookmark96)\]. Critical legal questions include: (1) Ownership and commercial rights: can private companies or governments claim ownership of products manufactured or resources extracted in space, such as satellites, habitats, or asteroid materials? (2) Regulatory frameworks: how should existing legal frameworks be updated to account for ISM, and who will enforce these regulations? (3) Jurisdictional challenges: determining which laws apply to space-based activities conducted by multinational entities. Lawmakers are currently debating whether to revise or expand existing treaties, such as the Outer Space Treaty, to address these emerging issues. Any updated framework must ensure that ISM aligns with international principles of fairness, cooperation, and shared benefit \[[98](#_bookmark97)\].

The development of ISM represents a monumental step forward for humanity, but it requires a robust and forward-thinking approach to policy, legal, and ethical considerations. By proactively addressing these challenges, we can ensure that space remains a shared and sustainable resource for generations to come.

# Conclusions

ISM represents a transformative leap in how humanity operates in space, with far-reaching implications for industries both in orbit and on Earth. Its most immediate and impactful advantage lies in its potential to significantly reduce costs. Manufacturing and assembling structures directly in space eliminates the need to launch heavy materials from Earth, saving billions of dollars. Furthermore, the ability to repair, upgrade, and recycle equipment in space reduces the frequency and cost of replacements, offering substantial economic and environmental benefits by lowering the carbon footprint of traditional space operations.

The rapid evolution of technology is the cornerstone of ISM’s progress. Innovations such as 3D printing in microgravity, advanced robotic systems for autonomous assembly, and the creation of stronger and lighter materials have brought ISM closer to reality. These technological breakthroughs not only enable future space missions but also drive

advancements in terrestrial manufacturing, enhancing efficiency and sustainability across multiple industries.

Looking ahead, continued research and development will be essential to unlocking the full potential of ISM. Key challenges include improving the reliability of robotic systems to operate autonomously in the harsh environment of space, understanding the long-term behavior of materials exposed to space conditions, and leveraging extraterrestrial resources such as asteroid or lunar mining to build a self-sustaining space economy. Equally impor-tant is establishing clear international policies and agreements to govern ISM. As more countries and private companies enter the space manufacturing sector, collaboration and cooperation will be crucial to ensuring equitable access to resources, fostering innovation, and preventing conflicts. A unified global effort can help ISM realize its promise as a catalyst for economic growth, technological advancement, and sustainable exploration beyond Earth. Overall, ISM is poised to revolutionize space exploration and industry, paving the way for a more sustainable and collaborative future in space and on Earth.

**Author Contributions:** Conceptualization, P.L.M.; writing—original draft preparation, S.A.J., J.J., J.F.,

T.S. and E.M.; writing—review and editing, S.A.J.; supervision, P.L.M. All authors have read and agreed to the published version of the manuscript.

**Funding:** The authors acknowledge the financial support from NASA CAN, grant number NV80NSSC20M0221.

**Conflicts of Interest:** The authors declare no conflict of interest.

# References

1.  Space Manufacturing—New World Encyclopedia. Available online: [https://www.newworldencyclopedia.org/entry/Space_](https://www.newworldencyclopedia.org/entry/Space_manufacturing) [manufacturing](https://www.newworldencyclopedia.org/entry/Space_manufacturing) (accessed on 26 January 2025).
2.  Building a Better Future in Orbit—NASA. Available online: [https://www.nasa.gov/humans-in-space/building-a-better-future-](https://www.nasa.gov/humans-in-space/building-a-better-future-in-orbit/)in-orbit/ (accessed on 25 February 2025).
3.  50 Years Ago: Skylab Medical Experiment Altitude Test Begins—NASA. Available online: [https://www.nasa.gov/history/50](https://www.nasa.gov/history/50-years-ago-skylab-medical-experiment-altitude-test-begins/)

[\-years-ago-skylab-medical-experiment-altitude-test-begins/](https://www.nasa.gov/history/50-years-ago-skylab-medical-experiment-altitude-test-begins/) (accessed on 25 February 2025).

1.  Hoffmann, M.; Elwany, A. In-Space Additive Manufacturing: A Review. _J. Manuf. Sci. Eng._ **2022**, _145_, 020801. \[[CrossRef](https://doi.org/10.1115/1.4055603)\]
2.  Moraguez, M.; de Weck, O. Benefits of In-Space Manufacturing Technology Development for Human Spaceflight. In Proceedings of the 2020 IEEE Aerospace Conference, Big Sky, MT, USA, 7–14 March 2020; pp. 1–11.
3.  Wang, G.; Zhao, W.; Liu, Y.F.; Cheng, T. Review of Space Manufacturing Technique and Developments. _Sci. Sin. Phys. Mech._

_Astron._ **2019**, _50_, 047006. \[[CrossRef](https://doi.org/10.1360/SSPMA-2019-0416)\]

1.  In-Space Manufacturing to Support Human Spaceflight—NASA Technical Reports Server (NTRS). Available online: [https://ntrs.](https://ntrs.nasa.gov/citations/20210021083) [nasa.gov/citations/20210021083](https://ntrs.nasa.gov/citations/20210021083) (accessed on 26 February 2025).
2.  On-Orbit Servicing, Assembly, and Manufacturing 2 (OSAM-2)—NASA. Available online: [https://www.nasa.gov/mission/on-](https://www.nasa.gov/mission/on-orbit-servicing-assembly-and-manufacturing-2-osam-2/)orbit-servicing-assembly-and-manufacturing-2-osam-2/ (accessed on 26 January 2025).
3.  Torgerson, A.; Rogers, R.M.; Anderson, A.M.; Galczak, S. Methodologies for Construction of the First Lunar Spaceport. In

_ASCEND 2021_; AIAA: Reston, VA, USA. \[[CrossRef](https://doi.org/10.2514/6.2021-4077)\]

1.  Chen, M.; Goyal, R.; Majji, M.; Skelton, R.E. Review of Space Habitat Designs for Long Term Space Explorations. _Prog. Aerosp. Sci._

**2021**, _122_, 100692. \[[CrossRef](https://doi.org/10.1016/j.paerosci.2020.100692)\]

1.  Ishfaq, K.; Maqsood, M.A.; Mahmood, M.A.; Pruncu, C. Opportunities and Challenges in Additive Manufacturing Used in Space Sector: A Comprehensive Review. _Rapid Prototyp. J._ **2022**, _28_, 2027–2042. \[[CrossRef](https://doi.org/10.1108/RPJ-05-2022-0166)\]
2.  Kushwaha, A.K.; Rahman, M.H.; Slater, E.; Patel, R.; Evangelista, C.; Austin, E.; Tompkins, E.; McCarroll, A.; Rajak, D.K.; Menezes,

P.L. 1—Powder Bed Fusion–Based Additive Manufacturing: SLS, SLM, SHS, and DMLS. In _Tribology of Additively Manufactured Materials_; Kumar, P., Misra, M., Menezes, P.L., Eds.; Elsevier Series on Tribology and Surface Engineering; Elsevier: Amsterdam, The Netherlands, 2022; pp. 1–37, ISBN 978-0-12-821328-5.

1.  Kushwaha, A.K.; Rahman, M.H.; Hart, D.; Hughes, B.; Saldana, D.A.; Zollars, C.; Rajak, D.K.; Menezes, P.L. 3—Fundamentals of Stereolithography: Techniques, Properties, and Applications. In _Tribology of Additively Manufactured Materials_; Kumar, P., Misra, M., Menezes, P.L., Eds.; Elsevier Series on Tribology and Surface Engineering; Elsevier: Amsterdam, The Netherlands, 2022;

pp. 87–106, ISBN 978-0-12-821328-5.

1.  Montez, M.; Willis, K.; Rendler, H.; Marshall, C.; Rubio, E.; Rajak, D.K.; Rahman, M.H.; Menezes, P.L. 5—Fused Deposition Modeling (FDM): Processes, Material Properties, and Applications. In _Tribology of Additively Manufactured Materials_; Kumar, P., Misra, M., Menezes, P.L., Eds.; Elsevier Series on Tribology and Surface Engineering; Elsevier: Amsterdam, The Netherlands, 2022; pp. 137–163, ISBN 978-0-12-821328-5.
2.  Evans, D.; Rahman, M.H.; Heintzen, M.; Welty, J.; Leslie, J.; Hall, K.; Menezes, P.L. 4—Additively Manufactured Functionally Graded Metallic Materials. In _Tribology of Additively Manufactured Materials_; Kumar, P., Misra, M., Menezes, P.L., Eds.; Elsevier Series on Tribology and Surface Engineering; Elsevier: Amsterdam, The Netherlands, 2022; pp. 107–136, ISBN 978-0-12-821328-5.
3.  Jose, S.A.; John, M.; Menezes, P.L. Cermet Systems: Synthesis, Properties, and Applications. _Ceramics_ **2022**, _5_, 210–236. \[[CrossRef](https://doi.org/10.3390/ceramics5020018)\]
4.  Prater, T.; Werkheiser, N.; Ledbetter, F.; Timucin, D.; Wheeler, K.; Snyder, M. 3D Printing in Zero G Technology Demonstration Mission: Complete Experimental Results and Summary of Related Material Modeling Efforts. _Int. J. Adv. Manuf. Technol._ **2019**, _101_, 391–417. \[[CrossRef](https://doi.org/10.1007/s00170-018-2827-7)\]
5.  Zocca, A.; Wilbig, J.; Waske, A.; Günster, J.; Widjaja, M.P.; Neumann, C.; Clozel, M.; Meyer, A.; Ding, J.; Zhou, Z.; et al. Challenges in the Technology Development for Additive Manufacturing in Space. _Chin. J. Mech. Eng. Addit. Manuf. Front._ **2022**, _1_, 100018. \[[CrossRef](https://doi.org/10.1016/j.cjmeam.2022.100018)\]
6.  König, N.F.; Reuter, M.; Reuß, M.; Kromer, C.S.F.; Herder, M.; Garmshausen, Y.; Asfari, B.; Israel, E.; Vasconcelos Lima, L.; Puvati, N.; et al. Xolography for 3D Printing in Microgravity. _Adv. Mater._ **2025**, _37_, 2413391. \[[CrossRef](https://doi.org/10.1002/adma.202413391)\]
7.  Bhundiya, H.G.; Royer, F.; Cordero, Z. Engineering Framework for Assessing Materials and Processes for In-Space Manufacturing.

_J. Mater. Eng. Perform._ **2022**, _31_, 6045–6059. \[[CrossRef](https://doi.org/10.1007/s11665-022-06755-y)\]

1.  Additive vs. Subtractive Manufacturing|Formlabs. Available online: https://formlabs.com/blog/additive-manufacturing-vs-subtractive-manufacturing/?srsltid=AfmBOoqQJo8nOPhIyJ8jjWCdAJ6SV78d95SepS0jWW2SHnX42jsnmL0G (accessed on 25 February 2025).
2.  Makaya, A.; Pambaguian, L.; Ghidini, T.; Rohr, T.; Lafont, U.; Meurisse, A. Towards out of Earth Manufacturing: Overview of the ESA Materials and Processes Activities on Manufacturing in Space. _CEAS Space J._ **2023**, _15_, 69–75. \[[CrossRef](https://doi.org/10.1007/s12567-022-00428-1)\]
3.  Seidel, A.; Teicher, U.; Ihlenfeldt, S.; Sauer, K.; Morczinek, F.; Dix, M.; Niebergall, R.; Durschang, B.; Linke, S. Towards Lunar In-Situ Resource Utilization Based Subtractive Manufacturing. _Appl. Sci._ **2024**, _14_, 18. \[[CrossRef](https://doi.org/10.3390/app14010018)\]
4.  Norman, A.; Das, S.; Rohr, T.; Ghidini, T. Advanced Manufacturing for Space Applications. _CEAS Space J._ **2023**, _15_, 1–6. \[[CrossRef](https://doi.org/10.1007/s12567-022-00477-6)\]
5.  Boyer, R.R. An Overview on the Use of Titanium in the Aerospace Industry. _Mater. Sci. Eng. A_ **1996**, _213_, 103–114. \[[CrossRef](https://doi.org/10.1016/0921-5093%2896%2910233-1)\]
6.  Anil Kumar, V.; Gupta, R.K.; Prasad, M.J.N.V.; Narayana Murty, S.V.S. Recent Advances in Processing of Titanium Alloys and Titanium Aluminides for Space Applications: A Review. _J. Mater. Res._ **2021**, _36_, 689–716. \[[CrossRef](https://doi.org/10.1557/s43578-021-00104-w)\]
7.  Kasar, A.K.; Jose, S.A.; D’Souza, B.; Menezes, P.L. Effect of hBN Content on the Friction and Wear Characteristics of Al<sub>2</sub>O<sub>3</sub>\-B<sub>2</sub>O<sub>3</sub>\-CaO-hBN Ceramic Composites under Dry Sliding Condition. _J. Mater. Eng. Perform._ **2024**, _17_, 14. \[[CrossRef](https://doi.org/10.1007/s11665-024-09953-y)\]
8.  Zhang, K.F.; Zhou, H.; Sang, R.P.; Wan, Z.H.; Hu, H.J. Applications of Nanostructured Materials as Additives in Space Fluid Lubricants. _Adv. Mater. Res._ **2012**, _602–604_, 214–222. \[[CrossRef](https://doi.org/10.4028/www.scientific.net/AMR.602-604.214)\]
9.  Ajay Kumar, P.; Vishnu Namboodiri, V.; Omrani, E.; Rohatgi, P.; Menezes, P.L. Solid Lubricants: Classification, Properties, and Applications. In _Self-Lubricating Composites_; Menezes, P.L., Rohatgi, P.K., Omrani, E., Eds.; Springer: Berlin/Heidelberg, Germany, 2022; pp. 1–29, ISBN 978-3-662-64243-6.
10. Ajay Kumar, P.; Vishnu Namboodiri, V.; Omrani, E.; Rohatgi, P.; Menezes, P.L. Self-Lubricating Polymer Composites: Mech-anisms, Properties, and Applications. In _Self-Lubricating Composites_; Menezes, P.L., Rohatgi, P.K., Omrani, E., Eds.; Springer: Berlin/Heidelberg, Germany, 2022; pp. 123–146, ISBN 978-3-662-64243-6.
11. John, M.; Menezes, P.L. Self-Lubricating Materials for Extreme Condition Applications. _Materials_ **2021**, _14_, 5588. \[[CrossRef](https://doi.org/10.3390/ma14195588)\]
12. Ralls, A.M.; Kumar, P.; Menezes, P.L. Tribological Properties of Additive Manufactured Materials for Energy Applications: A Review. _Processes_ **2021**, _9_, 31. \[[CrossRef](https://doi.org/10.3390/pr9010031)\]
13. Xiao, Y.; Yao, P.; Fan, K.; Zhou, H.; Deng, M.; Jin, Z. Powder Metallurgy Processed Metal-Matrix Friction Materials for Space Applications. _Friction_ **2018**, _6_, 219–229. \[[CrossRef](https://doi.org/10.1007/s40544-017-0171-9)\]
14. _Tribology of Additively Manufactured Materials_; Elsevier: Amsterdam, The Netherlands, 2022; ISBN 978-0-12-821328-5.
15. Ralls, A.M.; Monette, Z.; Kasar, A.K.; Menezes, P.L. Enhancing Tribological Performance of Self-Lubricating Composite via Hybrid 3D Printing and In Situ Spraying. _Materials_ **2024**, _17_, 2601. \[[CrossRef](https://doi.org/10.3390/ma17112601)\] \[[PubMed](https://www.ncbi.nlm.nih.gov/pubmed/38893868)\]
16. Antony Jose, S.; Kasar, A.K.; Stanford, M.; Menezes, P. Unlocking Tribological Performance of Silver-Infused Cu-Al<sub>2</sub>O<sub>3</sub> Self-Lubricating Cermet. _J. Tribol._ **2025**, _14_, 091107. \[[CrossRef](https://doi.org/10.1115/1.4067690)\]
17. Kasar, A.K.; Jose, S.A.; D’Souza, B.; Menezes, P.L. Fabrication and Tribological Performance of Self-Lubricating Porous Materials and Composites: A Review. _Materials_ **2024**, _17_, 3448. \[[CrossRef](https://doi.org/10.3390/ma17143448)\]
18. Gouzman, I.; Grossman, E.; Verker, R.; Atar, N.; Bolker, A.; Eliaz, N. Advances in Polyimide-Based Materials for Space Applications.

_Adv. Mater._ **2019**, _31_, 1807738. \[[CrossRef](https://doi.org/10.1002/adma.201807738)\] \[[PubMed](https://www.ncbi.nlm.nih.gov/pubmed/30803081)\]

1.  Automated Reconfigurable Mission Adaptive Digital Assembly Systems (ARMADAS)—NASA. Available online: [https://www.](https://www.nasa.gov/centers-and-facilities/langley/automated-reconfigurable-mission-adaptive-digital-assembly-systems-armadas/) [nasa.gov/centers-and-facilities/langley/automated-reconfigurable-mission-adaptive-digital-assembly-systems-armadas/](https://www.nasa.gov/centers-and-facilities/langley/automated-reconfigurable-mission-adaptive-digital-assembly-systems-armadas/) (ac-cessed on 26 January 2025).
2.  Zhang, Z.; George, A.; Ferdous Alam, M.; Eubel, C.; Prasad Vallabh, C.K.; Shtein, M.; Barton, K.; Hoelzle, D.J. An Additive Manufacturing Testbed to Evaluate Machine Learning-Based Autonomous Manufacturing. _J. Manuf. Sci. Eng._ **2024**, _146_, 031008. \[[CrossRef](https://doi.org/10.1115/1.4064321)\]
3.  Tang, J.; Wu, X. A Quality Assessment Network for Failure Detection in 3D Printing for Future Space-Based Manufacturing.

_Sensors_ **2023**, _23_, 4689. \[[CrossRef](https://doi.org/10.3390/s23104689)\]

1.  Berliner, A.J.; Hilzinger, J.M.; Abel, A.J.; McNulty, M.J.; Makrygiorgos, G.; Averesch, N.J.H.; Sen Gupta, S.; Benvenuti, A.; Caddell, D.F.; Cestellos-Blanco, S.; et al. Towards a Biomanufactory on Mars. _Front. Astron. Space Sci._ **2021**, _8_, 711550. \[[CrossRef](https://doi.org/10.3389/fspas.2021.711550)\]
2.  McNulty, M.J.; Xiong, Y.; Yates, K.; Karuppanan, K.; Hilzinger, J.M.; Berliner, A.J.; Delzio, J.; Arkin, A.P.; Lane, N.E.; Nandi, S.; et al. Molecular Pharming to Support Human Life on the Moon, Mars, and Beyond. _Crit. Rev. Biotechnol._ **2021**, _41_, 849–864. \[[CrossRef](https://doi.org/10.1080/07388551.2021.1888070)\]
3.  Cooper, M.; Douglas, G.; Perchonok, M. Developing the NASA Food System for Long-Duration Missions. _J. Food Sci._ **2011**, _76_,

R40–R48. \[[CrossRef](https://doi.org/10.1111/j.1750-3841.2010.01982.x)\]

1.  Risk of Performance Decrement and Crew Illness Due to an Inadequate Food System—NASA Technical Reports Server (NTRS). Available online: https://ntrs.nasa.gov/citations/20160011582 (accessed on 26 February 2025).
2.  Food in Space Needs to Be Rethought If We’re Going to Make a Mission to Mars. Available online: [https://qz.com/1277538/the-](https://qz.com/1277538/the-first-humans-sent-to-mars-will-need-to-3d-print-their-meals)first-humans-sent-to-mars-will-need-to-3d-print-their-meals (accessed on 26 February 2025).
3.  Mortimer, J.C.; Gilliham, M. SpaceHort: Redesigning Plants to Support Space Exploration and on-Earth Sustainability. _Curr. Opin._

_Biotechnol._ **2022**, _73_, 246–252. \[[CrossRef](https://doi.org/10.1016/j.copbio.2021.08.018)\]

1.  Reger, L.N.; Saballus, M.; Kampmann, M.; Wijffels, R.H.; Martens, D.E.; Niemann, J. Triple Space-Time Yield in Discontinuous Antibody Biomanufacturing by Combination of Synergetic Process Intensification Strategies. _Bioengineering_ **2023**, _10_, 1391. \[[CrossRef](https://doi.org/10.3390/bioengineering10121391)\] \[[PubMed](https://www.ncbi.nlm.nih.gov/pubmed/38135982)\]
2.  Stewart, L.H.; Trunkey, D.; Rebagliati, G.S. Emergency Medicine in Space. _J. Emerg. Med._ **2007**, _32_, 45–54. \[[CrossRef](https://doi.org/10.1016/j.jemermed.2006.05.031)\] \[[PubMed](https://www.ncbi.nlm.nih.gov/pubmed/17239732)\]
3.  Kringer, M.; Titz, A.; Maier, P.; Schill, F.; Pimpi, J.; Hoffman, L.; Lafont, U.; Reiss, P.; Pietras, M. Effects of Microgravity and Reduced Atmospheric Pressure on Manufacturing Photopolymer Specimens. _Acta Astronaut._ **2024**, _218_, 314–325. \[[CrossRef](https://doi.org/10.1016/j.actaastro.2024.01.033)\]
4.  Pernigoni, L.; Grande, A.M. Advantages and Challenges of Novel Materials for Future Space Applications. _Front. Space Technol._

**2023**, _4_, 1253419. \[[CrossRef](https://doi.org/10.3389/frspt.2023.1253419)\]

1.  Pyrkosz-Pacyna, J.; Cies´lak, K. Space Exploration Perception—Current and Future Research Directions. In _Selected Proceedings of the 6th Space Resources Conference_; Kołodziejczyk, A., Pyrkosz–Pacyna, J., Grabowski, K., Malinowska, K., Sergijenko, O., Eds.; Springer Nature: Cham, Switzerland, 2024; pp. 125–132.
2.  Pekdemir Bas¸eg˘ mez, M.; Asiliskender, B. Evolution of Production Spaces: A Historical Review for Projecting Smart Factories.

_Iconarp Int. J. Archit. Plan._ **2023**, _11_, 716–733. \[[CrossRef](https://doi.org/10.15320/ICONARP.2023.261)\]

1.  Hadler, K.; Martin, D.J.P.; Carpenter, J.; Cilliers, J.J.; Morse, A.; Starr, S.; Rasera, J.N.; Seweryn, K.; Reiss, P.; Meurisse, A. A Universal Framework for Space Resource Utilisation (SRU). _Planet. Space Sci._ **2020**, _182_, 104811. \[[CrossRef](https://doi.org/10.1016/j.pss.2019.104811)\]
2.  Williams, H.; Butler-Jones, E. Additive Manufacturing Standards for Space Resource Utilization. _Addit. Manuf._ **2019**, _28_, 676–681.

\[[CrossRef](https://doi.org/10.1016/j.addma.2019.06.007)\]

1.  Santhoshkumar, P.; Negi, A.; Moses, J.A. 3D Printing for Space Food Applications: Advancements, Challenges, and Prospects.

_Life Sci. Space Res._ **2024**, _40_, 158–165. \[[CrossRef](https://doi.org/10.1016/j.lssr.2023.08.002)\]

1.  Additive Manufacturing: Ensuring Quality for Spacecraft Applications—NASA Technical Reports Server (NTRS). Available online: https://ntrs.nasa.gov/citations/20150000375 (accessed on 26 January 2025).
2.  Challenges of In-Space Additive Manufacturing—NASA Technical Reports Server (NTRS). Available online: [https://ntrs.nasa.](https://ntrs.nasa.gov/citations/20170005622) [gov/citations/20170005622](https://ntrs.nasa.gov/citations/20170005622) (accessed on 26 January 2025).
3.  Nieman, K.; Leonard, A.F.; Tyrrell, K.; Messina, D.; Lopez, R.; Durand, H. Challenges and Opportunities for Next-Generation Manufacturing in Space. _IFAC-Pap._ **2022**, _55_, 963–968. \[[CrossRef](https://doi.org/10.1016/j.ifacol.2022.07.569)\]
4.  Malshe, H.; Bapat, S.; Vickers, J.; Malshe, A.P. Factories-in-Space for Servicing, Assembly, & Manufacturing. _Manuf. Lett._ **2023**, _38_,

24–28. \[[CrossRef](https://doi.org/10.1016/j.mfglet.2023.08.142)\]

1.  An Overview of the Thermal Challenges of Designing Microgravity Furnaces—NASA Technical Reports Server (NTRS). Available online: https://ntrs.nasa.gov/citations/20020050387 (accessed on 26 January 2025).
2.  Wilcox, W.; Regel, L. Microgravity Effects on Materials Processing: A Review. In Proceedings of the Conference Proceedings of EUROMAT 2001, Rimini, Italy, 10–14 July 2001.
3.  Pixner, F.; Warchomicka, F.; Lipin´ska, M.; Elmiger, S.; Jechtl, C.; Auer, P.; Riedlsperger, F.; Buzolin, R.; Domitner, J.; Lewandowska, M.; et al. Thermal Cycling Effects on the Local Microstructure and Mechanical Properties in Wire-Based Directed Energy Deposition of Nickel-Based Superalloy. _Addit. Manuf._ **2024**, _83_, 104066. \[[CrossRef](https://doi.org/10.1016/j.addma.2024.104066)\]

1.  In-Situ Resource Utilization (ISRU)—NASA. Available online: https://www.nasa.gov/mission/in-situ-resource-utilization-isru/ (accessed on 26 January 2025).
2.  Crawford, I.A.; Joy, K.H.; Anand, M. Chapter 25—Lunar Exploration. In _Encyclopedia of the Solar System_, 3rd ed.; Spohn, T., Breuer,

D., Johnson, T.V., Eds.; Elsevier: Boston, MA, USA, 2014; pp. 555–579, ISBN 978-0-12-415845-0.

1.  Manufacturing ZBLAN in Space. Available online: [https://issnationallab.org/upward/exotic-glass-fibers-from-space-the-race-](https://issnationallab.org/upward/exotic-glass-fibers-from-space-the-race-to-manufacture-zblan/)to-manufacture-zblan/ (accessed on 26 February 2025).
2.  In-Space Production Applications—ISS National Lab. Available online: [https://issnationallab.org/research-and-science/space-](https://issnationallab.org/research-and-science/space-research-overview/research-areas/in-space-production-applications/)research-overview/research-areas/in-space-production-applications/ (accessed on 26 February 2025).
3.  Northrop Grumman CRS-20 Delivers Fiber Optic Research. Available online: [https://issnationallab.org/press-releases/release-](https://issnationallab.org/press-releases/release-ng20-flawless-photonics-fiber-optics/)ng20-flawless-photonics-fiber-optics/ (accessed on 26 January 2025).
4.  Made in Space|Aerospace Testing International. Available online: [https://www.aerospacetestinginternational.com/features/](https://www.aerospacetestinginternational.com/features/made-in-space.html) [made-in-space.html](https://www.aerospacetestinginternational.com/features/made-in-space.html) (accessed on 26 January 2025).
5.  MISSE|Glenn Research Center|NASA. Available online: https://www1.grc.nasa.gov/space/iss-research/misse/ (accessed on 26 January 2025).
6.  International Space Station Welcomes Trio of Experiments Focused on Enhancing Life Beyond Earth—NASA Science. Available online: [https://science.nasa.gov/science-research/biological-physical-sciences/international-space-station-welcomes-trio-of-](https://science.nasa.gov/science-research/biological-physical-sciences/international-space-station-welcomes-trio-of-experiments-focused-on-enhancing-life-beyond-earth/)experiments-focused-on-enhancing-life-beyond-earth/ (accessed on 26 January 2025).
7.  Ghidini, T.; Grasso, M.; Gumpinger, J.; Makaya, A.; Colosimo, B.M. Additive Manufacturing in the New Space Economy: Current Achievements and Future Perspectives. _Prog. Aerosp. Sci._ **2023**, _142_, 100959. \[[CrossRef](https://doi.org/10.1016/j.paerosci.2023.100959)\]
8.  The Multimaterial Fabrication Laboratory: In-Space Manufacturing as an Enabling Technology for Long Endurance Human Spaceflight—NASA Technical Reports Server (NTRS). Available online: https://ntrs.nasa.gov/citations/20170012391 (accessed on 26 January 2025).
9.  NASA In-Space Manufacturing Technology—NASA Technical Reports Server (NTRS). Available online: [https://ntrs.nasa.gov/](https://ntrs.nasa.gov/citations/20210020434) [citations/20210020434](https://ntrs.nasa.gov/citations/20210020434) (accessed on 26 January 2025).
10. Torres, A.; Ganley, J.; Maji, A. Experimental and Analytical Techniques for Studying ZBLAN Crystallization in Microgravity. _Exp._

_Tech._ **2016**, _40_, 501–512. \[[CrossRef](https://doi.org/10.1007/s40799-016-0052-6)\]

1.  In-Space Manufacturing (ISM) ISS Refabricator Technology Demonstration—NASA Technical Reports Server (NTRS). Available online: https://ntrs.nasa.gov/citations/20190005004 (accessed on 26 January 2025).
2.  NASA’s In-Space Manufacturing Project: Update on Manufacturing Technologies and Materials to Enable More Sustainable and Safer Exploration—NASA Technical Reports Server (NTRS). Available online: https://ntrs.nasa.gov/citations/20190033333 (accessed on 26 January 2025).
3.  NASA Shares Progress Toward Early Artemis Moon Missions with Crew—NASA. Available online: [https://www.nasa.gov/](https://www.nasa.gov/news-release/nasa-shares-progress-toward-early-artemis-moon-missions-with-crew/) [news-release/nasa-shares-progress-toward-early-artemis-moon-missions-with-crew/](https://www.nasa.gov/news-release/nasa-shares-progress-toward-early-artemis-moon-missions-with-crew/) (accessed on 26 January 2025).
4.  NASA Awards $73.7 Million to Made In Space for Orbital Demonstration—SpaceNews. Available online: [https://spacenews.](https://spacenews.com/made-in-space-archinaut-one-demonstration/) [com/made-in-space-archinaut-one-demonstration/](https://spacenews.com/made-in-space-archinaut-one-demonstration/) (accessed on 26 January 2025).
5.  Redwire to Demonstrate In-Space Additive Manufacturing for Lunar Surface on the International Space Station|Redwire Space. Available online: [https://redwirespace.com/newsroom/redwire-to-demonstrate-in-space-additive-manufacturing-for-lunar-](https://redwirespace.com/newsroom/redwire-to-demonstrate-in-space-additive-manufacturing-for-lunar-surface-on-the-international-space-station/)surface-on-the-international-space-station/ (accessed on 26 January 2025).
6.  Edwards, B.C. Design and Deployment of a Space Elevator. _Acta Astronaut._ **2000**, _47_, 735–744. \[[CrossRef](https://doi.org/10.1016/S0094-5765%2800%2900111-9)\]
7.  Kringer, M.; Böhrer, C.; Frey, M.; Pimpi, J.; Pietras, M. Direct Robotic Extrusion of Photopolymers (DREPP): Influence of Microgravity on an in-Space Manufacturing Method. _Front. Space Technol._ **2022**, _3_, 899242. \[[CrossRef](https://doi.org/10.3389/frspt.2022.899242)\]
8.  Tofail, S.A.M.; Koumoulos, E.P.; Bandyopadhyay, A.; Bose, S.; O’Donoghue, L.; Charitidis, C. Additive Manufacturing: Scientific and Technological Challenges, Market Uptake and Opportunities. _Mater. Today_ **2018**, _21_, 22–37. \[[CrossRef](https://doi.org/10.1016/j.mattod.2017.07.001)\]
9.  Microgravity Manufacturing and R&D in Space|McKinsey. Available online: https://www.mckinsey.com/industries/aerospace-and-defense/our-insights/the-potential-of-microgravity-how-companies-across-sectors-can-venture-into-space (accessed on 26 January 2025).
10. The Geometry of Success: Archinaut Project Conducts First Large-Scale Additive Manufacturing Build in Space-Like Environment—NASA. Available online: https://www.nasa.gov/technology/manufacturing-materials-3-d-printing/the-geometry-of-success-archinaut-project-conducts-first-large-scale-additive-manufacturing-build-in-space-like-environment/ (accessed on 26 January 2025).
11. Rezapour Sarabi, M.; Yetisen, A.K.; Tasoglu, S. Bioprinting in Microgravity. _ACS Biomater. Sci. Eng._ **2023**, _9_, 3074–3083. \[[CrossRef](https://doi.org/10.1021/acsbiomaterials.3c00195)\]
12. NASA TechPort—Project. Available online: https://techport.nasa.gov/projects/116412 (accessed on 26 February 2025).
13. Wu, W.; Liu, W.; Qiao, D.; Jie, D. Investigation on the Development of Deep Space Exploration. _Sci. China Technol. Sci._ **2012**, _55_, 1086–1091. \[[CrossRef](https://doi.org/10.1007/s11431-012-4759-z)\]

1.  Wu, W.; Wang, C.; Liu, Y.; Qin, L.; Lin, W.; Ye, S.; Li, H.; Shen, F.; Zhang, Z. Frontier Scientific Questions in Deep Space Exploration.

_Chin. Sci. Bull._ **2023**, _68_, 606–627. \[[CrossRef](https://doi.org/10.1360/TB-2022-0667)\]

1.  Xing, Z.; Zhao, H.; Wen, B. Development Tendency and Key Technology of Deep Space Exploration’s Sample Return Capsule. In Proceedings of the International Conference on Space Information Technology, Beijing, China, 11 December 2009; Ma, X., Yang, B., Li, M., Eds.; Proc. SPIE 7651; p. 76510F.
2.  Arzo, S.T.; Sikeridis, D.; Devetsikiotis, M.; Granelli, F.; Fierro, R.; Esmaeili, M.; Akhavan, Z. Essential Technologies and Concepts for Massive Space Exploration: Challenges and Opportunities. _IEEE Trans. Aerosp. Electron. Syst._ **2023**, _59_, 3–29. \[[CrossRef](https://doi.org/10.1109/TAES.2022.3169126)\]
3.  George, K.W. The Economic Impacts of the Commercial Space Industry. _Space Policy_ **2019**, _47_, 181–186. \[[CrossRef](https://doi.org/10.1016/j.spacepol.2018.12.003)\]
4.  XU, Q.; Hollingsworth, P.; Smith, K. Launch Cost Analysis and Optimization Based on Analysis of Space System Characteristics.

_Trans. Jpn. Soc. Aeronaut. SPACE Sci._ **2019**, _62_, 175–183. \[[CrossRef](https://doi.org/10.2322/tjsass.62.175)\]

1.  Mani, S.; Dadhwal, V.K.; Shaijumon, C.S. India’s Space Economy, 2011–2012 to 2020–2021: Its Size and Structure. _Space Policy_ **2023**,

_64_, 101524. \[[CrossRef](https://doi.org/10.1016/j.spacepol.2022.101524)\]

1.  Li, D. Legal Challenges of Additive Manufacturing on the Moon. _Adv. Space Res._ **2024**, _73_, 5254–5265. \[[CrossRef](https://doi.org/10.1016/j.asr.2024.02.052)\]
2.  Rathman, K.A. Outer Space Commercialization and Its Ethical Challenges to International Law and Policy. _Technol. Soc._ **1999**, _21_, 135–166. \[[CrossRef](https://doi.org/10.1016/S0160-791X%2899%2900003-2)\]
3.  Metzger, P.T. Space Development and Space Science Together, an Historic Opportunity. _Space Policy_ **2016**, _37_, 77–91. \[[CrossRef](https://doi.org/10.1016/j.spacepol.2016.08.004)\]
4.  Billings, L. How Shall We Live in Space? Culture, Law and Ethics in Spacefaring Society. _Space Policy_ **2006**, _22_, 249–255. \[[CrossRef](https://doi.org/10.1016/j.spacepol.2006.08.001)\]

**Disclaimer/Publisher’s Note:** The statements, opinions and data contained in all publications are solely those of the individual author(s) and contributor(s) and not of MDPI and/or the editor(s). MDPI and/or the editor(s) disclaim responsibility for any injury to people or property resulting from any ideas, methods, instructions or products referred to in the content.
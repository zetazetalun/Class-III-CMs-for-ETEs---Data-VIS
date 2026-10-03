[Applied Surface Science 702 (2025) 163331](https://doi.org/10.1016/j.apsusc.2025.163331)

Contents lists available at [ScienceDirect](http://www.sciencedirect.com/science/journal/01694332)

Applied Surface Science

journal homepage: [www.elsevier.com/locate/apsusc](https://www.elsevier.com/locate/apsusc)

Full Length Article

Wettability characteristics of lunar soil particles from the Chang’E-5 mission: A single-particle surface analysis

Haotian Zhang [<sup>a</sup>](#_bookmark0)<sup>,</sup>[<sup>c</sup>](#_bookmark2)<sup>,</sup>[<sup>1</sup>](#_bookmark5), Jun Liu [<sup>a</sup>](#_bookmark0)<sup>,</sup>[<sup>b</sup>](#_bookmark1)<sup>,</sup>[<sup>1</sup>](#_bookmark5), Zhiping Yuan [<sup>a</sup>](#_bookmark0)<sup>,</sup>[<sup>1</sup>](#_bookmark5), Zhenxing Li [<sup>a</sup>](#_bookmark0)<sup>,</sup>[<sup>b</sup>](#_bookmark1), Xiaoyu Yao [<sup>a</sup>](#_bookmark0), Qianghui Xu [<sup>a</sup>](#_bookmark0),

Tongcai Wang [<sup>d</sup>](#_bookmark3), Yanjie Zheng [<sup>a</sup>](#_bookmark0), Gong Wang [<sup>d</sup>](#_bookmark3), Hu Zhang [<sup>c</sup>](#_bookmark2), Jun Shen [<sup>a</sup>](#_bookmark0)<sup>,</sup>[<sup>b</sup>](#_bookmark1)<sup>,</sup>[<sup>\*</sup>](#_bookmark4)

<sup>a</sup> _Department of Energy and Power Engineering, School of Mechanical Engineering, Beijing Institute of Technology, Beijing 100081, PR China_

<sup>b</sup> _Beijing Institute of Technology (Zhuhai), Beijing Institute of Technology, Zhuhai 519088, PR China_

<sup>c</sup> _School of Materials Science and Engineering, University of Science and Technology Beijing, Beijing 100083, PR China_

<sup>d</sup> _Key Laboratory of Space Manufacturing Technology (SMT), Technology and Engineering Center for Space Utilization, Chinese Academy of Sciences, Beijing 100094, PR China_

A R T I C L E I N F O

_Keywords:_

Chang’E-5 Lunar soil Wettability

Cassie-Baxter wetting model Young contact angle

A B S T R A C T

Lunar base construction has emerged as a strategic focus for global space agencies, with extrusion-based in situ resource utilization technologies recognized as a promising approach for utilizing lunar soil. However, a critical aspect of this technology lies in understanding the wettability characteristics between lunar soil and binding agents, such as water or resin. Here, the wetting dynamics were quantitatively analyzed through a custom- developed experimental apparatus combining ultra-deep field microscopy with a precision liquid evaporator. Our results demonstrate that the contact angle between a particle and water averages 108.73<sup>◦</sup> with a standard deviation of 3.60<sup>◦</sup>, thus indicating hydrophobicity. This phenomenon is primarily attributed to the distinctive surface morphology of the particle, characterized by adherent structures, porous architecture, and heterogeneous mineral fragments. Numerical simulations of droplet wetting behavior confirm that the Cassie-Baxter model accurately describes the observed phenomena. Through integrated experimental and computational analysis, we determined a surface tension of 8.46 mN/m between particles and water. For resin-particle interactions, the calculated Young contact angle of 96.18<sup>◦</sup> exceeds the directly computed 91.90<sup>◦</sup> from Young equation. This study establishes a novel framework for characterizing contact angles on micron-scale rough particles and provides crucial empirical support for extrusion-based extraterrestrial construction.

# Introduction

The establishment of lunar bases represents one of the most critical missions in lunar exploration. Numerous aerospace agencies worldwide have initiated plans to achieve this goal, leveraging advancements in space technology \[[1](#_bookmark15)\]. However, the complex terrain and harsh envi- ronmental conditions on the lunar surface \[[2](#_bookmark16)\], coupled with the limi- tations of rocket payload capacity, present significant challenges. In-suit resource utilization (ISRU) of lunar soil, combined with additive manufacturing, has emerged as a promising and viable solution for this endeavor \[[3](#_bookmark17),[4](#_bookmark18)\].

Lunar soils, as a naturally abundant raw material, distribute widely across the Moon’s surface. In recent years, China’s lunar sample return

mission successfully retrieved 1731 g of lunar soil, yielding significant research achievements \[[5](#_bookmark19)\]. In 2021, Li _et al_. reported a precise lead-lead age of 2,030 ± 4 million years for basalt clasts from the Chang’E-5 mission samples, providing conclusive evidence that magmatic activity persisted until at least 2 billion years ago \[[6](#_bookmark20)\]. Tian _et al_. further demonstrated that basalts in the returned samples originated from a non-KREEP (including potassium (K), the rare earth elements (REE), and phosphorus (P), termed KREEP) mantle source, indicating surges in volcanic activity around two billion years ago \[[7](#_bookmark21),[8](#_bookmark22)\]. In 2024, Wang et al. utilized isotopic dating to determine the precise age determination of three volcanic glass particles, estimating that volcanic activity occurred approximately 120 million years ago \[[9](#_bookmark23)\]. These findings challenge the earlier hypothesis that lunar geological activity ceased around 2.8 to 2.9

\* Corresponding author at: Department of Energy and Power Engineering, School of Mechanical Engineering, Beijing Institute of Technology, Beijing 100081, PR China.

_E-mail address:_ [jshen@bit.edu.cn](mailto:jshen@bit.edu.cn) (J. Shen).

<sup>1</sup> These authors contributed equally to this work.

https://doi.org/10.1016/j.apsusc.2025.163331

Received 11 December 2024; Received in revised form 16 April 2025; Accepted 22 April 2025

Available online 22 April 2025

0169-4332/© 2025 Published by Elsevier B.V.

billion years ago, significantly advancing our understanding of the Moon. Additionally, Guo _et al_. identified unique vesicular nanophase iron particles, as well as sub-microscopic magnetite and metallic iron particles, attributing their formation to lunar space weathering and the chemical reactions during impact process \[[10](#_bookmark24),[11](#_bookmark25)\]. Li _et al_. discovered abundant helium bubbles in the glass surface layer of lunar sample particles and proposed a mechanism for helium capture and extraction on the moon \[[12](#_bookmark26)\]. These groundbreaking results have continued to stimulate widespread interest in the study of Chang’E-5 lunar samples. It is well established that lunar soil is formed through space weath- ering processes under the Moon’s harsh environment, including mete- oroid and micro-meteoroid impacts, cosmic radiation, solar wind exposure and extreme temperature variations \[[13](#_bookmark27),[14](#_bookmark28)\]. This unique formation process results in significant differences between lunar soils and terrestrial soils in terms of surface morphology, internal structure, and particle size distribution, making lunar soil particularly well-suited for additive manufacturing technology \[[15](#_bookmark29)\]. Wu _et al_. systematically reviewed advancements in construction technologies for space bases, extraterrestrial in-situ resource utilization technologies (ISRU) and en- ergy systems, with a particular focus on additive manufacturing tech- niques for lunar base construction \[[16](#_bookmark30)\]. Among the potential additive manufacturing technologies applicable to lunar soils are stereo lithog- raphy appearance (SLA) \[[17](#_bookmark31),[18](#_bookmark32)\], selective laser sintering (SLS) \[[19](#_bookmark33),[20](#_bookmark34)\], directed energy deposition (DED) \[[21](#_bookmark35)\] and extrusion molding (ED) \[[22–24](#_bookmark36)\]. Extrusion molding, in particular, offers advantages such as rapid forming, simple and reliable equipment, and the ability to produce large-scale structures, making it widely used in terrestrial construction \[[25](#_bookmark37),[26](#_bookmark38)\]. It is therefore natural and reasonable to consider applying this technology to the lunar surface. However, a critical challenge in using ED for lunar soil is the requirement for minimal organic additives, such as resins, which are typically incorporated into to raw materials. Consequently, a key factor in successful extruded lunar soil forming is determining the surface characteristic parameter between lunar soil and resin, such as contact angle and surface tension, as these directly in- fluence the interaction strength and the quality of lunar base construc- tion. Thus, studying the wettability of lunar soil and designing effective

protective measures can also help minimize these potential hazards.

In contrast, establishing a physical model for the wettability of lunar soil particles through numerical simulation is essential for a deeper understanding of the wetting mechanism. Common methods for tracking interfaces with finite thickness in wettability studies include the volume of fluid (VOF) method \[[27](#_bookmark39)\], level set methods \[[28](#_bookmark40)\] and phase- field method \[[29](#_bookmark41)\]. Mouna Zaidani _et al_. employed the two-phase flow level set module to simulate pore-scale phenomenon in catalytic wetting on a bed layer \[[30](#_bookmark42)\]. Their findings demonstrated that the wetting characteristics of microchannels significantly influenced the fluid dy- namics of two-phase flow, identifying eight flow patterns in hydropho- bic microchannels and two flow patterns in hydrophilic channels. Song _et al_. proposed a model based on the moving mesh two-phase flow method to simulate contact angle hysteresis, including phenomena such as pinning, moving, and re-pinning of the contact line. This model is applicable to both two-dimensional and three-dimensional systems \[[31](#_bookmark43)\]. Zhang _et al_. used the two-phase flow phase-field module to simu- late the wetting process of liquid droplets on rough coal surfaces, revealing that the influence of rough interfaces on droplet contact angles follows the variation law described by the Wenzel model \[[32](#_bookmark44)\]. Among these methods, the two-phase flow phase-field method is particularly suitable for modeling the evolution of deformable interfaces, as it effectively handles topological changes and interface tension \[[33](#_bookmark45)\].

In this work, we focus on surface characteristic of a single lunar soil

particle. A new measurement method is introduced to directly deter- mine the contact angles of single particles. Based on actual wetting profile and contact angle data, a wettability model for lunar soil parti- cles is developed using the two-phase flow phase-field method in COMSOL Multiphysics (Sweden).The surface tension of single particles and the theoretical contact angles between the particles and water/resin

are calculated. The research on the wettability of a single particle pro- vides theoretical support for investigating the compositional compati- bility between lunar soils and resin, particularly for extruded lunar soil additive manufacturing technologies.

# Experimental

- 1.  _Lunar soil pretreatment_

The lunar soil used in this study was obtained from the China Na- tional Space Administration (CNSA), with sample code CE5C0400 (YJFM00901, 500 mg). This sample was collected during the Chang’-5 mission, which successfully returned lunar soil from the northeastern Oceanus Procellarum (51.916<sup>◦</sup>W, 43.058<sup>◦</sup>N) in 2020. The soil was sampled by scooping from the lunar surface during the mission. For the experiments, particles with relatively large particle size (on the order of hundreds of micrometers) were selected using a binocular optical mi- croscope and nonmagnetic tweezers. After sampling, the samples were adhered to conductive adhesive to enhance their conductivity for sur- face morphology analysis.

- 1.  _Characterization_

Field emission scanning electron microscopy (FESEM, Hitachi S- 4800, Japan) and energy dispersive spectroscopy (EDS, Bruker Esprit Compact, Germany) were employed to observe the surface morphology and analyze the composition of the selected lunar soil particles. Given the limited availability of the samples, no enhancement treatments, such as gold spraying, were applied to improve conductivity. SEM observa- tion was performed at a low accelerating voltage of 5 kV to minimize charging effects. EDS analysis was conducted in a high vacuum envi- ronment at an accelerating voltage of 15 kV.

- 1.  _Construction of contact angle measurement_

Due to the small particle size and rough surface of lunar soil particles, conventional contact angle measurement methods are not applicable, as droplets dispensed by standard pipettes or droppers tend to envelop the particles directly. To address this, we designed a custom contact angle measurement system for micron-sized particles, as shown in [Fig. 1](#_bookmark6)(a). The system primarily consists of a liquid evaporator (LE) and an ultra- deep field microscope (UDFM, OLYMPUS DSX1000, Evident Corpora- tion, Japan).The LE atomizes the liquid, which then passes through a conduit to condense on the particles surface. Contact angles measure- ments are conducted using the ultra-depth of field microscope, which offers a large depth of field, high resolution and real-time observation. This system is particularly well-suited for observing the contact angles and wetting processes of single particles with small sizes and rough surfaces. Contact angle measurements were conducted through real- time observation using the UDFM, with image acquisition performed only after the droplet had fully stabilized on the particle surface.

# Results and discussion

- 1.  _Surface morphology and composition_

[Fig. 2](#_bookmark7)(a) displays the surface FESEM images of the surface of a single particle. The particle exhibits angular shapes with uneven surface un- dulations. Upon closer examination, as shown in [Fig. 2](#_bookmark7)(b) and 2(c), adherents are observed on the particle surface, which may be glassy condensates formed by meteorite impacts or volcanic activity on the Moon \[[34](#_bookmark46),[35](#_bookmark47)\]. Further magnification of these adherents ([Fig. 2](#_bookmark7)(d)) re- veals a porous structure in the areas covered by the adherents. In addition, many mineral fragments ([Fig. 2](#_bookmark7)(e)) are conglutinated to the particle surface. The former is likely the result of the evaporation of components with lower boiling points \[[36](#_bookmark48)\], while the latter is probably

**Fig. 1.** Contact angle observation (a) Contact angle measurement process. (b and c) Measurement of wetting parameters of droplets: (b) Contact angle measurements, (c) Wetting parameters measurements.

due to long-term meteorite impacts and space weathering. [Fig. 2](#_bookmark7)(f) shows stair-like cleavage planes with sharp edges on the particle surface, a feature closely related to space weathering and micro-meteorite im- pacts over time. Notably, this characteristic is often observed in rock fragments primarily composed of pyroxene \[[37](#_bookmark49)\]. Collectively, these factors contribute to the highly complex surface roughness of the particle.

Fig. S2 shows the EDS spectrum of the elemental composition and distribution across the entire particle. It can be observed that the particle predominantly contains oxygen (O), silicon (Si) and iron (Fe), along with small amounts of aluminum (Al), magnesium (Mg), calcium (Ca), nickel (Ni), chromium (Cr), sodium (Na), manganese (Mn), potassium

(K), and titanium (Ti) (see Table S1). Compared to samples from the Apollo and Luna program, this sample exhibits higher concentrations of Fe and Ca, consistent with previous reports on Chang’E-5 lunar soil \[[38](#_bookmark50)\]. Based on the types and concentrations of elements, it is reasonable to infer that the particle is primarily pyroxene ((Ca,Mg,Fe)<sub>2</sub>Si<sub>2</sub>O<sub>6</sub>), with contributions from olivine ((Mg,Fe)<sub>2</sub>SiO<sub>4</sub>), plagioclase ((Mg,Fe)<sub>2</sub>SiO<sub>4</sub>), and minor amounts of ilmenite (FeTiO<sub>3</sub>) \[[39](#_bookmark51)\]. The presence of Ni further supports the occurrence of multiple meteorites impacts in the lunar soil collection area \[[40](#_bookmark52)\].

- 1.  _Measurement of contact angle between the single particle and water_

As mentioned above, one of the key parameters for extrusion mold- ing is the contact angle between lunar soil particles and resins. However, directly measuring the contact angle of high-viscosity resins on indi- vidual micrometer-sized particles is challenging due to experimental limitations. To address this, we have developed a setup based on an UDFM to measure the contact angle of rough micrometer-sized particles with water ([Fig. 1](#_bookmark6)(a)). Furthermore, by combining this contact angle with resin parameters such as surface tension, density, and dynamic viscosity, the contact angle between the single particle and resin can be theoretically determined.

Based on our experimental setup, eight droplets were deposited on the surface of the particle to determine the apparent contact angle be- tween the particle and water. The edge of a droplet just touching the particle surface was selected as the baseline for measurement, and the value at this point was recorded as the contact angle (_θ_). A circle was fitted using the edge of the droplet with the maximum curvature as a reference, and the radius of the circle (_R_) was taken as the droplet radius. The distance between the two points where the fitted circle intersects the baseline was measured as the contact length (_L_) between the droplet and the particle. To ensure more accurate results and reduce randomness, eight droplets on the single particle with the most optimal observation views were selected for contact angle measurement, as shown in [Fig. 1](#_bookmark6)

(b). The results indicate that the particle generally exhibits hydrophobic characteristics for all eight droplets, different from mineral particles on Earth, such as pyroxene and olivine, which typically exhibit hydrophilic behavior (see Fig. S5) \[[41](#_bookmark53),[42](#_bookmark54)\]. This unusual behavior may be attributed to the unique surface structure of the particle, including pores, debris, and adherents resulting from space weathering. The data are

**Fig. 2.** FESEM images of the surface morphology of a lunar soil particle. (a) Overall surface morphology of the particle. (b and c) Surface adhesions on the particle.

(d) Surface pores on the particle. (e) Surface debris on the particle. (f) Cleavage planes on the particle’s surface.

summarized in [Table 1](#_bookmark8) and will serve as the basis for modeling the droplets and surface roughness of the particle. The dimensional analysis of droplets was performed based on the experimental data presented in [Table 1](#_bookmark8). The droplet radius distribution ranged from 8.58 to 13.96 μm, with a mean value of 11.46 μm. The corresponding droplet volumes were calculated using the spherical cap volume formula:

_V_ \= 1 _πh_<sup>2</sup>(3_R_ — _h_) (1)

3

where _V_ represents the droplet volume (μm<sup>3</sup>), _h_ is the spherical cap height (μm), and _R_ denotes the droplet radius (μm). The calculated volumes exhibited a range from 1,887.97 to 10,828.58 μm<sup>3</sup>, with a mean volume of 6,113.97 μm<sup>3</sup>.

- 1.  _Numerical simulation_

- - 1.  _Construction of microcolumn surface models_

A two-dimensional model was constructed to simulate the wetting process of liquid droplets on the lunar soil particles. Based on FESEM observations, it was reasonably assumed that the surface roughness of the lunar soil particle consists of numerous micropillars of various heights, with identical widths and spacings, as derived by differential analysis. The maximum height of the micropillars was calculated using the equation

surface.

_3.3.3. Condition setting_

The dynamic viscosity and density of water and air were selected system-defined values using built-in materials, with the temperature set to 293.15 K and pressure set to atmospheric pressure. The surface ten- sion of water was taken as 72.80 mN/m. The data for the randomly generated micropillars from MATLAB were imported into the geometry module, and the heights of the two edges were extended to 50 μm, forming a closed region. The droplet radius _R_ was set slightly larger than the center of micropillars, as shown in [Fig. 3](#_bookmark10)(c). In the laminar flow module, the three boundary surfaces, except for the micropillars surface, were set as open boundaries, while in the phase-field module, there were set as outlets to simulate the interaction between the micropillars’ sur- face and the droplet in an atmospheric environment. The intrinsic contact angle of the lunar soil particle was set to 106.2<sup>◦</sup>, determined as the average of contact angle measurements taken at three relatively flat regions on the particle surface (see [Fig. 1](#_bookmark6)(b)).To improve computational accuracy, the grid was partitioned into triangles using a hyperfine mesh with a minimum element size of 7.47 × 10<sup>3</sup> μm, as shown in [Fig. 3](#_bookmark10)(d) (See Table S2 in the Supplementary Materials for detailed parameters). According to the modeling process of the micropillars described above, the height of the highest micropillars for each of the 8 droplets were obtained. Based on the data, the surface morphology will be generated when the droplets fall.

_H_ \= _R_ — √̅_R_̅̅̅2̅̅̅̅̅̅̅̅̅̅_L_̅̅̅̅2̅̅

— (2)

(2)

- 1.  _Numerical simulation results of lunar soil with water_

where _L_ is the contact length and _R_ is the droplet radius, as illustrated in [Fig. 3](#_bookmark10)(a). Considering the size of the particle and droplets, a computa- tional region consisting of micropillars with a width of 50 μm was defined to simulate the particle surface. The widths of the micropillars were set as 0.2 μm, and their heights were randomly generated using a random seed. The simulated surface shown in [Fig. 3](#_bookmark10)(b) was created using MATLAB software (MATLAB2023, MathWorks, America) \[[43](#_bookmark55)\].

_3.3.2. Selection of physics field_

The two-phase flow phase-field method was employed to track the gas–liquid-solid triple interface. Compared to the VOF method, which has strict requirements for grid quality and interface merging, and the level-set method, which has limited computational accuracy and does not conserve mass, the phase-field method offers more accurate modeling of deformable interfaces and ensures mass conservation dur- ing numerical simulation \[[44](#_bookmark56),[45](#_bookmark57)\]. This method uses a diffusion interface of finite thickness, represented by the field variable _φ_, which can be controlled by the Cahn-Hilliard nonlinear diffusion equation to differ- entiate between gas phase and liquid phase \[[46](#_bookmark58)\]. Specifically, the liquid phase is represented by _φ_ \= -1, the gas phase by _φ_ \= 1, and the value between —1 and 1 represents two phases in a mixed state. Additionally, by combining the phase-field method with the laminar interface approach, it is possible to simultaneously solve the continuity equations and Navier-Stokes equations. As a result, the phase-field method was selected to simulate the wetting process of a droplet on the particle

**Table 1**

Wetting parameters of the particle.

The process of a droplet falling onto the particle surface, as simulated by COMSOL, is shown in [Fig. 4](#_bookmark13)(a). The droplet reaches a stable wetting state in a short time, closely resembling the actual wetting behavior of the droplet. The simulation results indicate that the liquid droplet initially contacts the particle surface under the influence of gravity and then gradually enters the micropillars on the surface of the model. The air inside the micropillars is compressed and gradually stabilizes be- tween the liquid and the particle surface. FESEM analysis reveals numerous factors that increase surface roughness at the micrometer and nanometer scale. Based on this, it can be inferred that the deposition process of the particles follows the Cassie-Baxter model. Furthermore, the contact angles obtained from the simulation are in good agreement with experimental values, as shown in [Fig. 4](#_bookmark13)(b). However, the simula- tion assumes the fluid is incompressible, neglecting minor changes in viscosity and surface tension under pressure. Additionally, the temper- ature of the solid surface is assumed to be uniform, which omits the influence of temperature on surface tension and viscosity. As a result, there may be some deviation between the simulated contact and actual contact angles.

According to the Cassie-Baxter model (see the Eq. (S2) in the Sup- plementary Materials), the solid–liquid contact area fraction is denoted by _f_, the gas–liquid contact area fraction is (1-_f_), and the contact angle between the droplet and air is 180<sup>◦</sup>. Substituting these into Eq. (S2), the contact angle formula suitable for the lunar soil particle in the Cassie- Baxter state can be expressed as:

cos_θ_<sub>CB</sub> = _f_(cos_θ_<sub>E</sub> + 1) — 1 (3)

where _θ_<sub>CB</sub> is the apparent contact angle measured experimentally, and

**Droplets Apparent contact angle (degree)**

**Droplet radius (μm)**

**Contact length (μm)**

_θ_<sub>E</sub> is the Young contact angle of the particle.

During the wetting process of the particle, the fraction of the solid-

Droplet 1 123.1<sup>◦</sup> 11.93 17.50

Droplet 2 122.3<sup>◦</sup> 8.79 17.14

Droplet 3 120.3<sup>◦</sup> 13.95 21.50

Droplet 4 119.3<sup>◦</sup> 13.00 21.98

Droplet 5 117.6<sup>◦</sup> 8.58 14.98

Droplet 6 116.7<sup>◦</sup> 9.60 15.70

–liquid contact area _f_ can be represented in a two-dimensional model by dividing the length of the droplet in contact with the micropillar surface (_L_<sub>l</sub>) by the total length of the micropillars surface between the two ends of the droplet (_L_<sub>g</sub>),

_L<sub>l</sub>_

_g_

Droplet 7 113.6<sup>◦</sup> 13.96 19.08

Droplet 8 106.6<sup>◦</sup> 11.84 20.86

_f_ \= _L_

(4)

**Fig. 3.** Construction of model. (a) Schematic diagram of calculating the maximum height of micro-column. (b) MATLAB-generated surface map of micropillars with maximum height of 6.84 μm. (c) Model boundary conditions. (d) Model mesh division.

where _L_<sub>g</sub> is calculated using MATLAB, and _L_<sub>l</sub> is obtained through inte- gration of the length of the droplet on the micropillars surface (wetting wall) by using a non-local coupling method. After calculating the sol- id–liquid contact area fraction _f_, and substituting it into Eq. (S2) along with _θ_<sub>CB</sub>, the Young contact angle _θ_<sub>E</sub> of the particle can be determined. A total of eight sets of droplet data were computed to obtain both the fraction of solid–liquid contact area _f_ and the Young contact angle _θ_<sub>E</sub> of the particle, as shown in [Table 2](#_bookmark14).

Both roughness and compositional changes affect the wettability between the solid and liquid phases, resulting in variations in contact angles at different locations on the particle surface.

According to the Young equation,

cos_θ_<sub>E</sub> = (_γ_<sub>SV</sub> — _γ_<sub>SL</sub>)_/γ_<sub>LV</sub> (5)

where _γ_<sub>SL</sub> can be estimated using the following equation \[[47](#_bookmark59)\]:

106.2<sup>◦</sup>, which further supports the reliability and accuracy of the model in simulating the particle’s surface characteristics.

- 1.  _Numerical simulation results of a lunar soil particle with epoxy resin_

After obtaining the theoretical contact angle between the lunar soil particle and water, as well as the surface tension of the lunar soil par- ticle,we proceed to derive the contact angle between the lunar soil particle and epoxy resin. Based on the surface tension of epoxy resin (_γ_<sub>LV</sub>\*=36.18 mN/m) at 293.15 K, the theoretical contact angle _θ_<sub>E</sub>\* = 91.90<sup>◦</sup> between the epoxy resin and the lunar soil can be calculated using Eq. [(7)](#_bookmark12).

For the simulation of the wetting behavior of the lunar soil particle towards epoxy resin, we use the average droplets radius _R_\*=11.46 μm from regions 1 to 8 and the average height _H_\*=5.03 μm of the maximum micropillars to represent the size and morphology of the epoxy resin

_γ_SL ≈ _γ_SV + _γ_LV — 2,̅_γ_̅̅S̅V̅̅̅_γ_̅̅L̅V̅̅̅

(6)

droplets and lunar soil particle surface, respectively. The simulation uses the key parameters of epoxy resin for fluid 2 (density _ρ_ \= 1.2 g/cm<sup>3</sup>,

Substituting Eq. [(6)](#_bookmark11) into the Young equation yields the estimation for- mula for the theoretical contact angle, Eq. [(7)](#_bookmark12):

dynamic viscosity _μ_ \= 13 Pa⋅s and surface tension _γ_<sub>LV</sub> = 36.18 mN/m), while other parameters remain unchanged. The simulated apparent

√̅_γ_̅̅̅̅̅̅

contact angle _θ_<sub>CB</sub>\* is about 102.4<sup>◦</sup>, as shown in Fig. S6. From this, the

cos_θ_<sub>E</sub> 2 <sup>SV</sup> LV

_γ_ — 1 (7)

\=

solid–liquid contact length _L_g\*=219.51 μm is obtained by integrating the solid–liquid contact length _L_<sub>l</sub>\*=192.90 μm. The solid–liquid contact

By applying Eq. [(7)](#_bookmark12) and substituting the surface tension of water at

293.15 K, the surface tension of the particle can be determined. By calculating _γ_<sub>SV</sub> for droplets 1 to 8 and averaging the values, the surface tension of the lunar soil is estimated to be 8.46 mN/m. The theoretical average contact angle of 108.73<sup>◦</sup> closely matches the measured value of

area fraction _f_\* is then computed as 0.8788 using Eq. [(4)](#_bookmark9). Subsequently, the theoretical contact angle _θ_<sub>E</sub>\*<sub>1</sub> can be calculated as 96.18<sup>◦</sup>using Eq.

[(7)](#_bookmark12) with the values of _f_\* and _θ_<sub>CB</sub>\*. This result is close to the previously calculated value of _θ_<sub>E</sub>\*, confirming that the results obtained by this method are reliable. The discrepancy in contact angles between the two methods can be attributed to differences in model assumptions,

**Fig. 4.** The results of experiment and simulation. (a-d) Final drop shape of droplet wetting simulation. (e-l) Comparison of simulated and experimentally measured contact angles for all eight drops:(e) droplet 1, (f) droplet 2, (g) droplet 3, (h) droplet 4, (i) droplet 5, (j) droplet 6, (k) droplet 7, (l) droplet 8.

**Table 2**

Fraction of solid–liquid contact area _f_ and Young contact angle _θ_<sub>E</sub> of the lunar soil particle.

|     |     |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
|     | **Droplet 1** | **Droplet 2** | **Droplet 3** | **Droplet 4** | **Droplet 5** | **Droplet 6** | **Droplet 7** | **Droplet 8** |
| _f_ | 0.6986 | 0.7104 | 0.8425 | 0.763 | 0.7834 | 0.7661 | 0.8896 | 0.8994 |
| _θ_<sub>E</sub> | 110.50<sup>◦</sup> | 110.15<sup>◦</sup> | 114.32<sup>◦</sup> | 109.32<sup>◦</sup> | 108.36<sup>◦</sup> | 106.33<sup>◦</sup> | 109.02<sup>◦</sup> | 101.87<sup>◦</sup> |

geometric complexity, parameter accuracy, and numerical precision. Nonetheless, both experimental and simulation results indicate that the lunar soil particle exhibits a typical hydrophobic feature due to its distinctive surface structures compared to earth soil particles. It is, however, essential to develop and optimize surface modification tech- niques that improve the compatibility between lunar soils and resin. The

simulation conditions were designed to represent the internal environ- ment of the extrusion nozzle, where maintaining controlled pressure is necessary for stable slurry flow and extrusion quality, differing from the vacuum conditions of the lunar surface. This will be crucial for enhancing the feasibility of extrusion molding processes in lunar base construction.

# Conclusions

In this study, the contact angle of a micrometer-sized lunar soil particle was directly measured using an ultra-deep field microscope equipped with a liquid evaporator. A wettability model was developed to simulate the wetting process of the particle, combining COMSOL with MATLAB for numerical simulations. Experimental observations and numerical simulation confirmed that the wettability between lunar soil particles and water follows the Cassie-Baxter model. The experimental results revealed an contact angles of 108.73<sup>◦</sup> (with a standard deviation of 3.60<sup>◦</sup>) and a surface tension of 8.46 mN/m. Using the average wetting parameters obtained from the lunar soil–water experiments, the liquid was replaced by epoxy resin for numerical simulation. The simulation result showed that the wettability between the resin and the lunar soil particle also follows the Cassie-Baxter model, with an apparent contact angle of 102.40<sup>◦</sup> and a theoretical contact angle is 96.18<sup>◦</sup>. The theo- retical contact angle between resin and particle, calculated directly using the Young equation, was 91.90<sup>◦</sup>. The close agreement between the theoretical contact angle obtained from the simulation and the one calculated using the Young equation further validates the reliability of the model. Although wettability varies due to roughness and composi- tional differences across different regions of the lunar soil particle, this study provides theoretical and model-based support for understanding the compositional compatibility between lunar soils and resin. This is particularly relevant for advancing the technology of extruded lunar soil in additive manufacturing for lunar base construction.

# CRediT authorship contribution statement

**Haotian Zhang:** Writing – review & editing, Writing – original draft, Data curation, Conceptualization. **Jun Liu:** Writing – review & editing, Project administration, Conceptualization. **Zhiping Yuan:** Writing – review & editing, Project administration, Conceptualization. **Zhenxing Li:** Project administration. **Xiaoyu Yao:** Project administration. **Qian- ghui Xu:** Project administration. **Tongcai Wang:** Project administra- tion. **Yanjie Zheng:** Writing – review & editing. **Gong Wang:** Project administration. **Hu Zhang:** Writing – review & editing, Writing – orig- inal draft, Data curation, Conceptualization. **Jun Shen:** Writing – review & editing, Supervision, Resources.

# Declaration of competing interest

The authors declare that they have no known competing financial interests or personal relationships that could have appeared to influence the work reported in this paper.

# Acknowledgements

Thanks to all the staff of China’s Chang’E Lunar Exploration Project for their hard work in returning lunar samples and China National Space Administration (CNSA) for providing the lunar sample. This work was supported by the National Key Research and Development Program of China (Grant No. 2022YFB3505100), and the National Natural Science Foundation of China (Grant No. 51925605, 52201036 and 52206034). The authors are highly grateful to Prof. Wei Yang and Prof. Hengci Tian of IGG CAS for providing the valuable suggestions about particle se- lection of lunar samples.

# Appendix A. Supplementary data

Supplementary data to this article can be found online at [https://doi.](https://doi.org/10.1016/j.apsusc.2025.163331) [org/10.1016/j.apsusc.2025.163331](https://doi.org/10.1016/j.apsusc.2025.163331).

# Data availability

Data will be made available on request.

# References

1.  H. Benaroya, L. Bernold, K.M. Chua, Engineering, design and construction of lunar bases, J. Aerosp. Eng. 15 (2002) 33–45, https://doi.org/10.1061/(ASCE)0893-

1321(2002)15:2(33).

1.  E. Grün, M. Horanyi, Z. Sternovsky, The lunar dust environment, Planet. Space Sci. 59 (2011) 1672–1680, https://doi.org/10.1016/j.pss.2011.04.005.
2.  S. Ulubeyli, Lunar shelter construction issues: the state-of-the-art towards 3D printing technologies, Acta Astronaut. 195 (2022) 318–343, [https://doi.org/](https://doi.org/10.1016/j.actaastro.2022.03.033) [10.1016/j.actaastro.2022.03.033](https://doi.org/10.1016/j.actaastro.2022.03.033).
3.  Y.S. Wang, L. Hao, Y. Li, Q.L. Sun, M.X. Sun, Y.H. Huang, Z. Li, D.N. Tang, Y.

J. Wang, L. Xiao, In-situ utilization of regolith resource and future exploration of additive manufacturing for lunar/martian habitats: A review, Appl. Clay. Sci. 229 (2022) 106673, https://doi.org/10.1016/j.clay.2022.106673.

1.  T. Zhang, B. Wang, H.Y. Wei, Y.L. Zhang, C.Y. Chao, K. Xu, X.L. Ding, X.Y. Hou,

Z. Zhao, Review on planetary regolith-sampling technology, Prog. Aerosp. Sci. 127 (2021) 100760, https://doi.org/10.1016/j.paerosci.2021.100760.

1.  Q.L. Li, Q. Zhou, Y. Liu, Z.Y. Xiao, Y.T. Lin, J.H. Li, H.X. Ma, G.Q. Tang, S. Guo,

X. Tang, J.Y. Yuan, J. Li, F.Y. Wu, Z.Y. Ouyang, C.L. Li, X.H. Li, Two-billion-year- old volcanism on the Moon from Chang’e-5 basalts, Nature 600 (2021) 54–58, https://doi.org/10.1038/s41586-021-04100-2.

1.  H. C. Tian, C. Zhang, W. Yang, J. Du, Y. Chen, Z.Y. Xiao, R.N. Mitchell , H.J, Hui , H.G, Changela, T.X. Zhang, X. Tang , D. Zhang , Y.T, Lin , X,H, Li , F. Wu, Surges in volcanic activity on the Moon about two billion years ago, Nat. Com-mun. 14 (2023) 3734, https://doi.org/10.1038/s41467-023-39418-0.
2.  H.C. Tian, H. Wang, Y. Chen, W. Yang, Q. Zhou, C. Zhang, H.L. Lin, C. Huang, S.

T. Wu, L.H. Jia, L. Xu, D. Zhang, X.G. Li, R. Chang, Y.H. Yang, L.W. Xie, D.P. Zhang,

G.L. Zhang, S.H. Yang, F.Y. Wu, Non-KREEP origin for Chang’e-5 basalts in the Procellarum KREEP Terrane, Nature 600 (2021) 59–63, [https://doi.org/10.1038/](https://doi.org/10.1038/s41586-021-04119-5) [s41586-021-04119-5](https://doi.org/10.1038/s41586-021-04119-5).

1.  B.W. Wang, Q.W. Zhang, Y. Chen, W.H. Zhao, Y. Liu, G.Q. Tang, H.X. Ma, B. Su, H.

J. Hui, J.W. Delano, F.Y. Wu, X.H. Li, Y.Y. He, Q.L. Li, Returned samples indicate volcanism on the Moon 120 million years ago, Science 385 (2024) 1077–1080, https://doi.org/10.1126/science.adk6635.

1.  Z. Guo, C. Li, Y. Li, Y.Y. Wen, K.R. Tai, X.Y. Li, J.Z. Liu, Z.Y. Ouyang, Nanophase iron particles derived from fayalitic olivine decomposition in Chang’E-5 lunar soil: implications for thermal effects during impacts, Geophys. Res. Lett. 49 (2022) e2021GL097323, https://doi.org/10.1029/2021gl097323.
2.  Z. Guo, C. Li, Y. Li, Y.Y. Wen, Y.X. Wu, B.J. Jia, K.R. Tai, X.J. Zeng, X.Y. Li, J.Z. Liu,

Z.Y. Ouyang, Sub-microscopic magnetite and metallic iron particles formed by eutectic reaction in Chang’E-5 lunar soil, Nat. Commun. 13 (2022) 7177, [https://](https://doi.org/10.1038/s41467-022-35009-7) [doi.org/10.1038/s41467-022-35009-7](https://doi.org/10.1038/s41467-022-35009-7).

1.  A. Li, X. Chen, L.J. Song, G.X. Chen, W. Xu, J.T. Huo, M. Gao, M. Li, L. Zhang, B.

N. Yao, M. Ji, Y. Zhang, S.F. Zhao, W. Yao, Y.H. Liu, J.Q. Wang, H.Y. Bai, Z.G. Zou,

M.F. Yang, W.H. Wang, Taking advantage of glass: capturing and retaining the helium gas on the moon, Materials Futures 1 (2022) 035101, [https://doi.org/](https://doi.org/10.1088/2752-5724/ac74af) [10.1088/2752-5724/ac74af](https://doi.org/10.1088/2752-5724/ac74af).

1.  C.M. Pieters, S.K. Noble, Space weathering on airless bodies, J. Geophys. Res. Planets 121 (2016) 1865–1884, https://doi.org/10.1002/2016je005128.
2.  L.P. Keller, D.S. McKay, The nature and origin of rims on lunar soil grains Geochim, Cosmochim. Acta 61 (1997) 2331–2341, [https://doi.org/10.1016/s0016-7037(97)](https://doi.org/10.1016/s0016-7037%2897%2900085-9)

[00085-9](https://doi.org/10.1016/s0016-7037%2897%2900085-9).

1.  G. Heiken, Petrology of lunar soils, Rev. Geophys. 13 (1997) 567–587, [https://doi.](https://doi.org/10.1029/rg013i004p00567) [org/10.1029/rg013i004p00567](https://doi.org/10.1029/rg013i004p00567).
2.  W.R. Wu, J. Shen, H. Kong, Y. Yang, E.X. Ren, Z.K. Liu, W.D. Wang, M.M. Dong, L.

J. Han, C. Yang, H.F. Zheng, Q.H. Xu, X.Y. Yao, J. Zhao, S. Li1, Q.Q. Yang, J.Liu, Y.

F. Zhang, J. Li, Y.P. Guo, J.W. Li, M.R. Li, H. Liu, D.Z. Zheng, R. Xiong, J.F. Ma, Z.

Zhang, G. Pei, X. Z. Ao , J. Ji, W.A. Sun, T. Fei , F.Q. Wang, Z.X. Zhang, J.Z. Liu, Y.

Wei, W. Yang, L. Zhao, A.B. Zhang, Y.Y. Wang, J.J. Liu, W.Y. Xu, C.F. Zhang, R.N.

Xu, L.L. Chen, Z.G. Qu, H. Wang, Y.J. Lu, D.W. Jing, L. Li, H.W. Li, T.F. Li, R. Chen,

J.Y. Xiong1, Y. Kong, H.S. Wang , J. Qin , Y. Shuai , X.J. Zeng, B. Shen , F.C. Sun, Z. Tao, T.S. Zhao, P.X. Jiang, Energy system and resource utilization in space: A state- of-the-art review, The Innovation Energy 1 (2024)100029-1, https://doi.org/ 10.59717/j.xinn-energy.2024.100029.

1.  M. Mukhtarkhanov, A. Perveen, D. Talamona, Application of stereolithography based 3D printing technology in investment casting, Microm-Achines 11 (2020) 946, https://doi.org/10.3390/mi11100946.
2.  D.M. Dehurtevent, L. Robberecht, J.C. Hornez, A. Thuault, E. Deveaux, P. B´ehin, Stereolithography: A new method for processing dental ceramics by additive computer-aided manufacturing, Dent Mater 33 (2017) 477, [https://doi.org/](https://doi.org/10.1016/j.dental.2017.01.018) [10.1016/j.dental.2017.01.018](https://doi.org/10.1016/j.dental.2017.01.018).
3.  J.P. Kruth, X. Wang, T. Laoui, L. Froyen, Lasers and materials in selective laser sintering, Assem. Autom. 23 (2003) 357–371, [https://doi.org/10.1108/](https://doi.org/10.1108/01445150310698652)

[01445150310698652](https://doi.org/10.1108/01445150310698652).

1.  E.O. Olakanmi, R.F. Cochrane, K.W. Dalgarno, A review on selective laser sintering/melting SLS/SLM of aluminium alloy powders: processing, microstructure, and properties, Prog. Mater. Sci. 74 (2015) 401–477, [https://doi.](https://doi.org/10.1016/j.pmatsci.2015.03.002) [org/10.1016/j.pmatsci.2015.03.002](https://doi.org/10.1016/j.pmatsci.2015.03.002).
2.  D. Svetlizky, M. Das, B. Zheng, A.L. Vyatskikh, S. Bose, A. Bandyopadhyay,

M. Julie, Directed energy deposition DED additive manufacturing: physical characteristics, defects, challenges and applications, Mater. Today 49 (2021) 271–295, https://doi.org/10.1016/j.mattod.2021.03.020.

1.  M. Strano, K. Rane, M.A. Farid, V. Mussi, V. Zaragoza, M. Monno, Extrusion-based additive manufacturing of forming and molding tools, Int. J. Adv. Manuf. Technol. 117 (2021) 2059–2071, https://doi.org/10.1007/s00170-021-07162-8.

1.  A.M. Gohn, D. Brown, G. Mendis, S. Forster, N. Rudd, M. Giles, Mold inserts for injection molding prototype applications fabricated via material extrusion additive manufacturing, Addit. Manuf. 51 (2022) 102595, [https://doi.org/10.1016/j.](https://doi.org/10.1016/j.addma.2022.102595) [addma.2022.102595](https://doi.org/10.1016/j.addma.2022.102595).
2.  F. Kern, R. Gadow, Extrusion and injection molding of ceramic micro and nanocomposites, Int. J. Mater. Form. 2 (2009) 609–612, [https://doi.org/10.1007/](https://doi.org/10.1007/s12289-009-0487-8) [s12289-009-0487-8](https://doi.org/10.1007/s12289-009-0487-8).
3.  M.H. Ali, S. Batai, D. Sarbassov, 3D printing: a critical review of current development future prospects, Rapid Prototyping J. 25 (2019) 1108–1126, [https://](https://doi.org/10.1108/rpj-11-2018-0293) [doi.org/10.1108/rpj-11-2018-0293](https://doi.org/10.1108/rpj-11-2018-0293).
4.  J. Breitenbach, Melt extrusion: from process to drug delivery technology, Eur. J. Pharm. Biopharm. 54 (2002) 107–117, [https://doi.org/10.1016/s0939-](https://doi.org/10.1016/s0939-64110200061-9)

[64110200061-9](https://doi.org/10.1016/s0939-64110200061-9).

1.  C.W. Hirt, B.D. Nichols, Volume of fluid VOF method for the dynamics of free boundaries, J. Comput. Phys. 39 (1981) 201–225, [https://doi.org/10.1016/0021-](https://doi.org/10.1016/0021-99918190145-5)

[99918190145-5](https://doi.org/10.1016/0021-99918190145-5).

1.  S. Osher, R.P. Fedkiw, Level set methods: an overview and some recent results,

J. Comput. Phys.1 169 (2001) 463–502, https://doi.org/10.1006/jcph.2000.6636.

1.  T.P. Yue, J.J. Feng, C. Liu, J. Shen, A diffuse-interface method for simulating two- phase flows of complex fluids, J. Fluid Mech. 515 (2004) 293–317, [https://doi.org/](https://doi.org/10.1017/s0022112004000370) [10.1017/s0022112004000370](https://doi.org/10.1017/s0022112004000370).
2.  C. Li, J. Zhang, J. Han, B.H. Yao, A numerical solution to the effects of surface roughness on water–coal contact angle, Sci. Rep. 11 (2021) 459, [https://doi.org/](https://doi.org/10.1038/s41598-020-80729-9) [10.1038/s41598-020-80729-9](https://doi.org/10.1038/s41598-020-80729-9).
3.  M.R. Pivello, M.M. Villar, R. Serfaty, A.M. Roma, A. Sil-veira-Neto, A fully adaptive front tracking method for the simulation of two phase flows, Int. J. Multiphase Flow 58 (2014) 72, https://doi.org/10.1016/j.ijmultiphaseflow.2013.08.009.
4.  M. Zaidani, A. Hasan, M. Al-musharfy, M. Sassi, Numerical investigation of surface wettability on gas–Liquid flow hydrodynamics in microchannel: application to trickle bed reactors, J. Pet. Sci. Eng. 184 (2020) 106576, [https://doi.org/10.1016/](https://doi.org/10.1016/j.petrol.2019.106576) [j.petrol.2019.106576](https://doi.org/10.1016/j.petrol.2019.106576).
5.  Z. Cai, Y.L. Song, Implementing contact angle hysteresis in moving mesh-based two-phase flow numerical simulations, ACS Omega 6 (2021) 35711–35717, https://doi.org/10.1021/acsomega.1c05613.
6.  N.E.B. Zellner, Lunar impact glasses: probing the Moon’s surface and constraining its impact history, J. Geophys. Res. Planets 124 2686–2702 (2019), [https://doi.](https://doi.org/10.1029/2019JE006050) [org/10.1029/2019JE006050](https://doi.org/10.1029/2019JE006050).
7.  J.F. Lindsay, L.J. Srnka, Galactic dust lanes and lunar soil, Nature 257 (1975) 776–778, https://doi.org/10.1038/257776a0.
8.  T. Matsushima, J. Katagiri, K. Saiki, A. Tsuchiyama, M. Ohtake, T. Nakano, K. Uesugi, in 3D Particle Characteristics of High-landLunar Soil (No. 60501) Obtained by Micro X-Ray CT: Pro-ceedings ofthe 11th Biennial Asce Aerospace Division Interna-tional Conferenceon Engineering (American Society of Civil Engineers, California,2008), pp. 1-8.
9.  C. Li, Y. Li, K. Wei, Z. Guo, H. Yu, X. Chen, X.Y. Li, W.H. Ma, J.Z. Liu, Study on

surface characteristics of Chang’E-5 fine grained lunar soil, Sci. Sin.-Phys. Mech. Astron. 53 (2022) 239603, https://doi.org/10.1360/SSPMA-2022-0343.

1.  C.L. Li, H. Hu, M. F. Yang, Z. Y. Pei, Q. Zhou , X. Ren , B. Liu , D. w. Liu , X.G. Zeng ,

G.L. Zhang , H.B. Zhang , J.J. Liu , Q. Wang , X.J. Deng , C.J. Xiao , Y.G. Yao , D.S. Xue , W. Zuo , Y. Su , W.B. Wen ,and Z.Y. Ouyang, Characteristics of the lunar samples returned by the Chang’E-5 mission, Natl. Sci. Rev. 9 (2022) nwab188, https://doi.org/10.1093/nsr/nwab188.

1.  D.W. Liu, X. Wang, J.J. Liu, B. Liu, X. Ren, Y. Chen, Z.P. Chen, H.B. Zhang, G.

L. Zhang, Q. Zhou, Z.B. Zhang, Q. Fu, C.L. Li, Spectral interpretation of late-stage mare basalt mineralogy unveiled by Chang’E-5 samples, Nat. Commun. 13 (2022) 5965, https://doi.org/10.1038/s41467-022-33670-6.

1.  E.C. McIntosh, J.M. Day, Y. Liu, C. Jiskoot, Examining the compositions of impactors striking the Moon using Apollo impact melt coats and anorthositic regolith breccia meteorites, Geochim. Cosmochim. Acta 274 (2020) 192–210, https://doi.org/10.1016/j.gca.2020.01.051.
2.  A. Al-Yaseri, M. Ali, M. Ali, R. Taheri, D. Wolff-Boenisch, Western Australia basalt- CO2-brine wettability at geo-storage conditions, J. Colloid Interface Sci. 603 (2021) 165–171, https://doi.org/10.1016/j.jcis.2021.06.078.
3.  L.A. Rose, J.M. Brenan, Wetting properties of Fe-Ni-Co-Cu-OS melts against olivine: implications for sulfide melt mobility, Econ. Geol. 96 (2001) 145–157, [https://doi.](https://doi.org/10.2113/gsecongeo.96.1.145) [org/10.2113/gsecongeo.96.1.145](https://doi.org/10.2113/gsecongeo.96.1.145).
4.  H. Chen, Y.Z. Hu, H. Wang, W.Z. Wang, Computer simulation of rough surfaces, Lubr. Eng. 10 (2006) 52–55, [https://doi.org/10.3969/j.issn.0254-](https://doi.org/10.3969/j.issn.0254-0150.2006.10.016)

[0150.2006.10.016](https://doi.org/10.3969/j.issn.0254-0150.2006.10.016).

1.  G.P. Zhu, J. Yao, L. Zhang, H. Sun, A.F. Li, B. Shams, Investigation of the dynamic contact angle using a direct numerical simulation method, Langmuir 32 (2016) 11736–11744, https://doi.org/10.1021/acs.langmuir.6b02543.
2.  M. Wo¨rner, Numerical modeling of multiphase flows in microfluidics and micro

process engineering: a review of methods and applications, Microfluid. Nanofluid. 12 (2012) 841–886, https://doi.org/10.1007/s10404-012-0940-8.

1.  F. Boyer, C. Lapuerta, S. Minjeaud, B. Piar, M. Quintard, Cahn–Hilliard/

Navier–Stokes model for the simulation of three-phase flows, Transp Porous Media 82 (2010) 463–483, https://doi.org/10.1007/s11242-009-9408-z.

1.  [J.N. Israelachvili, Intermolecular and surface forces, Academic Press, 2011](http://refhub.elsevier.com/S0169-4332%2825%2901045-1/h0235).
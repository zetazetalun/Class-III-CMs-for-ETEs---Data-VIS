[Earth Planet. Sci. Lett. 654 (2025) 119239](https://doi.org/10.1016/j.epsl.2025.119239)

Contents lists available at [ScienceDirect](http://www.sciencedirect.com/science/journal/0012821X)

Earth and Planetary Science Letters

journal homepage: [www.elsevier.com/locate/epsl](https://www.elsevier.com/locate/epsl)

Unity of terrestrial and extraterrestrial soils in granular configuration

Jun Zhang [<sup>a</sup>](#_bookmark0)<sup>,</sup>[<sup>b</sup>](#_bookmark1)<sup>,</sup>[<sup>c</sup>](#_bookmark2), Yong Li [<sup>a</sup>](#_bookmark0)<sup>,</sup>[<sup>\*</sup>, Yifei Cui](#_bookmark4) [<sup>b</sup>](#_bookmark1)<sup>,</sup>[<sup>\*</sup>](#_bookmark4), Zi Wu [<sup>b</sup>](#_bookmark1), Yuan Xue [<sup>b</sup>](#_bookmark1), Jianyi Cheng [<sup>a</sup>](#_bookmark0)<sup>,</sup>[<sup>c</sup>](#_bookmark2),

Hu Jiang [<sup>a</sup>](#_bookmark0)<sup>,</sup>[<sup>c</sup>](#_bookmark2), Yao Li [<sup>a</sup>](#_bookmark0)<sup>,</sup>[<sup>b</sup>](#_bookmark1)<sup>,</sup>[<sup>c</sup>](#_bookmark2), Jian Guo [<sup>b</sup>](#_bookmark1), Jiayan Nie [<sup>d</sup>](#_bookmark3), Guodong Wang [<sup>b</sup>](#_bookmark1), Ao Luo [<sup>b</sup>](#_bookmark1)

<sup>a</sup> _Key Laboratory of Mountain and Surface Process, Institute of Mountain Hazards and Environment, Chinese Academy of Sciences, Chengdu 610041, China_

<sup>b</sup> _State Key Laboratory of Hydroscience and Engineering, Department of Hydraulic Engineering, Tsinghua University, Beijing 100084, China_

<sup>c</sup> _University of Chinese Academy of Sciences, Beijing 100049, China_

<sup>d</sup> _School of Civil Engineering, Wuhan University, Wuhan 430072, PR China_

A R T I C L E I N F O

Editor: Dr O Mousis

_Key words:_

Soil genesis Lunar regolith

Numerical simulant Random simulation Granular field

A B S T R A C T

Grain size distribution (GSD) is crucial for understanding soil properties and surface processes. We find that both terrestrial soils and lunar soils are subjected to a unified GSD function, _P_(_D_)= _g_(_μ_)_D<sup>\-</sup>μ_exp(-_D/D_<sub>c</sub>), reducing the textural fractions and grade modes to a parameter pair (_μ, D_<sub>c</sub>), which unifies terrestrial and extraterrestrial soils

in granular configuration, beyond the environments and mechanisms of soil genesis. To construct a framework of the soil formation, we generalize the textural composition to a grade space representing the granular configu- ration, and conceptualize soil genesis as the random aggregation of the fractal fragmentation of parent litho- spheric material and fragments from other sources (e.g., meteorites impacts or surface transport processes). Random simulation reproduces the multiple grade modes observed in soils, and spontaneously derives the unified GSD function. Then we numerically generate the (_μ, D_<sub>c</sub>)-fields for soils on earth and moon, which refine the digital data mapping based on site measurements and depict the local fluctuation of soil parameters. The GSD unity also provides a tool of generating “numerical simulants” of lunar soils to fill the gap in material simulants. The study leads to a GSD-paradigm (in contrast to the conventional landscape-paradigm) in soil study, which is expected to facilitate the data harmonization on earth and promote the generation of lunar regolith data in favor of the in-situ resource utilization and base construction on moon.

# Introduction

Both the Earth and Moon are blanketed by a “skin” of soil dominating in the surface processes, e.g., mass movements and transport and space weathering ([Heiken et al., 1991](#_bookmark34); [Legros, 2012](#_bookmark43)). Studies on terrestrial soils (TS) are focused on the genesis, distribution, and physical and chemical properties, under the assumption of a pedogenesis function of climate (or water availability), parent material (lithospheric substance), biota, topography, and time ([Paton et al., 2023](#_bookmark56); [Schaetzl, 2005](#_bookmark66); [Wilding,](#_bookmark85) [1994](#_bookmark85)). Similar conception applies to the genesis of lunar soil (LS) and other extraterrestrial soils (ES), but under the extreme conditions spe- cific to the moon, e.g., hypervelocity impacts of meteorites, cosmic rays, solar winds, and great day-night fluctuation of temperature ([Guo et al.,](#_bookmark31) [2024](#_bookmark31); [Ohtake et al., 2009](#_bookmark55); [Rickman et al., 2012](#_bookmark63)). Although TS and LS are intrinsically different in terms of mineral constituents and phys- ical/chemical properties, the paradigm of TS studies has been adopted in LS research. Specifically, the properties and constitutive models of LS

are experimentally or numerically investigated based on its textural composition and grain size distribution (GSD) (e.g., [Ueda et al., 2010](#_bookmark80); [Xu](#_bookmark87) [et al., 2024](#_bookmark87)). In addition, both studies use “substitutes” for representing real soils, due to the difficulties in-situ experiments and the scarcity of site samples. No amount of data can represent the variability and spatial heterogeneity of soils. One usually employs man-made granular mate- rials for geotechnical tests and geophysical flow experiments (e.g., [Iverson, 1997](#_bookmark38); [Jaeger et al., 1996](#_bookmark39)). This leads to the issue of data acquisition and generalization. TS data on large scale is presented by digital mapping based on limited samples, field measurements, and remote sensing data, such as the Harmonized World Soil Database (HWSD), the Soil Map of the World (SMW), and the map of POLARIS Soil Properties ([Chaney et al., 2016](#_bookmark25); [Shangguan et al., 2014](#_bookmark71); [Shi et al., 2004](#_bookmark72)). This data-mapping methodology follows the soil-landscape paradigm (e. g., [Hudson, 1990](#_bookmark36), [1992](#_bookmark35)) rooted in the pedogenesis function; it usually gives representative values and ranges of soil properties (e.g., [Chaney](#_bookmark26) [et al., 2015](#_bookmark26), [2019](#_bookmark24); [Koster et al., 2000](#_bookmark41); [Niu et al., 2011](#_bookmark54); [Porporato, 2002](#_bookmark60);

\* Corresponding authors.

_E-mail addresses:_ [ylie@imde.ac.cn](mailto:ylie@imde.ac.cn) (Y. Li), [yifeicui@mail.tsinghua.edu.cn](mailto:yifeicui@mail.tsinghua.edu.cn) (Y. Cui).

https://doi.org/10.1016/j.epsl.2025.119239

Received 17 November 2024; Received in revised form 12 January 2025; Accepted 23 January 2025

Available online 1 February 2025

0012-821X/© 2025 Elsevier B.V. All rights are reserved, including those for text and data mining, AI training, and similar technologies.

[Subin et al., 2014](#_bookmark75)), setting the background but providing no specific functions that can derive properties necessary for the dynamics of sur- face processes.

A similar situation occurs in studies of the Moon, Mars, Jupiter, Saturn, and even the Martian moon Phobos and the near-Earth asteroid Itokawa, where various simulants have been used for science and en- gineering purposes ([Landsman et al., 2021](#_bookmark42); [Pieters et al., 2016](#_bookmark59); [Taylor](#_bookmark76) [et al., 2016](#_bookmark76)). The simulants are manufactured from terrestrial minerals (e.g., mixtures of anorthosite, glass, basaltic ash, cinder-cone deposit, noritic material), covering a wide compositional and petrographic range of terrestrial feedstocks ([Arslan et al., 2010](#_bookmark18); [Battler, 2009](#_bookmark20); [Easter et al.,](#_bookmark27) [2024](#_bookmark27); [Martin et al., 2022](#_bookmark50); [Wang et al., 2024](#_bookmark83); [Willman et al., 1995](#_bookmark86); [Zheng](#_bookmark92) [et al., 2009](#_bookmark92); [Zou et al., 2024](#_bookmark93)). One might use materials (e.g., from igneous rocks) that have been converted to phases (e.g., carbonates, sulfates, hydrated oxides, clays) that are not present in lunar miner- alogy; and there are also materials (e.g., those generated by hyperve- locity impacts of micrometeorites) that do not appear in our planet. For examples, the simulant MLS-1 does not have the correct mineralogy and chemistry as the Apollo 11 samples, with exception of the TiO<sub>2</sub> content to mimic the high-Ti basaltic soils ([Weiblen et al., 1990](#_bookmark84)), and the composition of JSC-1 represents only 2–3 % of the lunar surface ([McKay](#_bookmark51) [et al., 1994](#_bookmark51)). Generally, simulants are only partially satisfactory for special purposes and in many cases unsatisfactory ([Taylor et al., 2016](#_bookmark76)). In practice, achieving the high fidelity to both the mineral composition and GSD is rarely possible (e.g., as the case of the LHS-1 and LMS-1); most simulants (e.g., JSC-1, BP-1, GRC-1, GRC-3) are neither mineral- ogically nor geomechanically accurate, made through unnaturally altering composition and GSD till the desired physical properties are attained ([Long-Fox et al., 2023](#_bookmark48)). Since balancing mineral fidelity and GSD consistency is challenging, and GSD has been identified as the primary property for manufacturing simulants ([Isachenkov et al., 2022](#_bookmark37); [Schrader et al., 2010](#_bookmark67); [Sibille et al., 2006](#_bookmark73)), which significantly affects the mechanical, thermal, electrical, and volatile retention properties of regolith; it is tempting to base simulant production on GSD when granular-governed properties are of concern, similar to how we model granular flows on Earth. The scarcity of LS samples has led to the comparative neglect of soil data on regional or landscape scale on mares and highlands. In this respect, we are facing the same problems as for TS, requiring digital mapping for the dataset, which is important for the in-situ resource utilization (ISRU) and base construction.

In summary, both studies on TS and ES encounter the difficulty in

data generation and harmonization. The current situation is inferring data from various sources, through interpolation/extrapolation and supplements of material analogs. We note that a unified GSD function might bridge the material gap between TS and LS and MS ([Li et al., 2017](#_bookmark45); [Zhang et al., 2023](#_bookmark90)), which will afford unified indices to facilitate the data harmonization and generalization. As mechanical properties are more dependent on the GSD than on the material composition, the TS and LS are unified as granular ensemble.

In this letter, we first establish a unity of soils by applying the unified GSD function to TS, LS, and MS (i.e., soils of Mars) samples. Next, we conceptualize soil genesis as a stochastic process involving the random aggregation of fragments from parent materials and other surface pro- cesses (e.g., meteorites impact and material transport), and we develop a stochastic framework to generate grade modes that spontaneously derive the unified GSD function. The model does not depend on the details of the environments; it works the same for LS as for TS. The derived GSD parameters make it possible to generate random fields of soil to integrate the conventional datasets, and realize numerical simu- lants as useful complements for the costly material simulants of LS. The GSD unity leads to a new paradigm not only bridging the gap between soil genesis and surface processes, but also facilitating the data-driven discovery and machine learning in geosciences.

# Materials and methods

- 1.  _Variety in textures and grade modes_

This study is based on thousands of soil samples, including TS sam- ples collected by the authors and from literatures and LS samples from the Apollo and Luna missions ([Graf, 1993](#_bookmark29); [Heiken et al., 1991](#_bookmark34)) and the recent Chang’E missions ([Zhang et al., 2022](#_bookmark88)). The TS samples, collected from the five continents, represent soils from vegetated slopes, arable lands, gully terrains, and coastal beaches. The LS samples, on the other hand, originate from the highlands and lunar mares ([Ohtake et al., 2009](#_bookmark55); [Guo et al., 2024](#_bookmark31)) ([Fig. 1](#_bookmark5)). In addition, the MS (i.e., soils from the Mars) samples by the Curiosity rover ([Sahu, 2024](#_bookmark65)) are also employed for comparison. (Data sources are detailed in the Supplementary Materials). Conventional textural fractions and statistical measures are used for describing the soils ([Carrier, 2003](#_bookmark23); [Graf, 1993](#_bookmark29); [Willman et al., 1995](#_bookmark86)). In

textures, the samples cover almost all the USDA triangle ([Fig. 2](#_bookmark6)a, in which only fine fractions (<2 mm) are included), and their frequency curves _p_(_D_) present diverse grade modes, i.e., unimodal, bimodal, tri-

modal, and multimodal ([Fig. 2](#_bookmark6)b-e). TS from different regions present distinct modes: e.g., unimodal for soils from CD, JZG, HN; bimodal for Ord, KLM, MLS; trimodal for MLP, XC ([Fig. 2](#_bookmark6)e); and multimodal for Fin, MDG, JSR, etc. ([Fig. 2](#_bookmark6)f). In comparison, LS and MS also fall into various modes; but most are bimodal. This is corelated to the special prove- nance. As exemplified by the samples in Mare Crisium, with peaks at about 0.1 and 1 mm, corresponding to that it is formed by coarse fraction from the fresh ejecta and fine fraction mixed by the subsequent mete- oritic and micrometeoritic impacts ([McKay et al., 1978](#_bookmark52)).

- 1.  _Unity in GSD_

Despite the variability of textures and grade modes, all the soils satisfy the following unified GSD function ([Li et al., 2017](#_bookmark45); [Zhang et al.,](#_bookmark90) [2023](#_bookmark90)):

_P_(_D_) = _g_(_μ_)_D_<sup>—</sup>_<sup>μ</sup>_exp( — _D_/_D<sub>c</sub>_) (1)

where _P_(_D_) is the exceedance percentage, _μ_ and _D_<sub>c</sub> are fitting parame- ters, and _g_(_μ_) is a coefficient function. Rescaling the grain size by _D_\*= (_D_/_D_<sub>c</sub>) and the fraction by _P_\*(_D_) = _P_(_D_)_D <sup>μ</sup>_/_g_(_μ_), the rescaled curves for different soils collapse upon a unique exponential curve _P_\*(_D_) = exp (–_D\*_) ([Fig. 2](#_bookmark6)g), with the coefficients identical to a unique curve, _g_(_μ_) = _b_exp(-_aμ_) ([Fig. 2](#_bookmark6)h). The statistical significance of the fit is confirmed, passing both the _χ_<sup>2</sup>\-independence test and _t_\-test at level of _p_ \= 0.001. The robustness of fitting suggests that the function is not a casually

statistical result, but should be a rule with underlying mechanism, with _g_

(_μ_) similar to the coefficient of Gamma or Weibull distribution.

The GSD function unifies TS, LS, and MS as granular ensembles in- dependent of the environments and mechanisms; even other terrestrial bodies, e.g., the asteroid Itokawa, presents the similar GSD curve for the regolith grains ([Tsuchiyama et al., 2011](#_bookmark77)). The GSD-unity allows us to consider the unique significance of the granular configuration of soil, i. e., considering soil as a pure ensemble of grains with the natural packing state and geometry. The configuration governs the major physical and mechanical properties of soil, e.g., diffusivity, porosity, density, shear strength, comressibility, bearing capacity, as well as thermal and elatic properties ([Slyuta, 2014](#_bookmark74)); and then the conceptions and methods of granular mechanics can be employed in this new area.

As far as the granular configuration is concerned, variation of soil reduces to the variation of GSD. One may ignore the variability of mineral compositions and the influences due to the presence of oxygen, biotic activity, wind, and water on earth and the continuous meteoroid impacts and persistent bombardment by charged atomic particles on moon ([Heiken et al., 1991](#_bookmark34)). In this sense, soils either in earth and planetary bodies are simply productions of granular cycles (i.e., the processes of loss and gain in grains).

**Fig. 1.** Global distribution of sampling sites of terrestrial soil (TS) and lunar soil (LS), with representative soil photos. (a) TS sources (4419 samples) from 18 countries across the five continents: Asia (China, Singapore, South Korea, Thailand, Iran), Europe (Finland, Sweden, France, Bulgaria, Romania, Poland, Germany, Russia), Africa (Nigeria), North America (USA, Canada), and Australia; with photos depicting the environments: (a-1), Vegetated slope in southwest China (photo by the author); (a-2) Arable land, Sweden; (a-3) Gully terrain, Nigeria; (a-4) Canyon, USA; (a-5) Coastal beach, Australia. (b) LS sampling sites, dates, and images of lunar surface. The Apollo and Luna samples were collected from a central area of the lunar nearside, the Chang’e-5 (CE-5) landing on the Rümker region in the northern Oceanus Procellarum in the northwest of the nearside, and Chang’E-6 on the farside South Pole-Aitken (SPA) basin. Photos (b-1, 2, 3) show the sampling environment of Apollo 11, 15, and 16, representing the mare, basin margin, and highland.

**Fig. 2.** Granular characteristics of the TS,LS, and MS samples in terms of classification, texture composition, and grain size distribution (GSD). (a) the USDA triangle;

(b) Cumulative frequency curves; (c) ~ (f) Frequency curves with different grade modes; (g) Rescaled curve of the unified GSD function; (h) Coefficient of coin- cidence function _g_(_μ_).

- 1.  _Textural diffusion and grade space_

The GSD-unity imposes a universal constraint on the variation of grade modes. As illustrated in [Fig. 2](#_bookmark6)b-e, the mode is preserved within a specific soil type, which means that the fraction in each grade varies independently and there are no remarkable “interchanges” between grades. Textural analysis indicates that samples of a certain type of soil have their textural fractions _p<sub>i</sub>_ varying independently (with Pearson correlation coefficient as low as 0.06 between textures) and following the normal distribution, Nor(_η, σ_) (with _η_ being the mean, and _σ_ the

variance, passing Shapiro-Wilk test with _p_ \> 0.05). [Table 1](#_bookmark9) lists the

Normal parameters for the major textures (gravel, sandy, silty, and clay) for TS, LS, and MS.

The invariance of grade mode for a soil suggests that a soil type keeps a specific granular configuration featured by the mode. Therefore, the grade is of special significance and it is reasonable to generalize the texture composition to a “grade space”, which can be symbolically expressed as a linear space expanded by a set of basis {**e**_<sub>i</sub>_}:

**p** \= ∑⊕_ξ_ **e** (_i_ \= 0, 1, 2, ..._N_) (2)

_i i_

_i_

where the symbol ⊕ denotes the union of component of base **e**_<sub>i</sub>_, with fraction _ξ<sub>i</sub>_. This defines soil as granular ensemble by the set {_ξ<sub>i</sub>_}; and it reduces to the texture classification when _ξ<sub>i</sub>_ is taken as _p<sub>i</sub>_ or when **e**_<sub>i</sub>_ is set

identical to the sieving grade.

Obviously, the grade space generalizes the soil as mixture of discrete parts (textures) to a “continuum” covering a wide range of grain size; and thus each component of basis **e**<sub>i</sub> can be considered as a phase of the continuum. In such a scenario, soil is a multiphase mixture of which each grade-phase _ξ<sub>i</sub>_ diffuses independently, with intensity of the diffu-

sion featured by the observed variance _σ_ \= (_Kt_)<sup>1/2</sup> (_K_ being the diffusion

coefficient). Grade-phase diffusion, as the generalization of textural changes, has been widely observed in surface processes on earth, e.g., soil avalanches and failures, sediment transport, and other geophysical flows. Similar processes are also ubiquitous on planetary bodies, as exemplified by pyroclastic flows and avalanches on Mars and Venus, and also by the mixing with non-mare materials due to the transport of

nearby massifs on almost all mare surface on moon ([Liu et al., 2020](#_bookmark47)). In

fragment sources by two distinct processes: the cascading fragmentation from parent lithospheric materials (rocks), and the random contribu- tions from other specific processes. These extra-contributions include the fragments from space weathering and meteorites impact, as well as surface processes like pyroclastic flows. As illustrated in [Fig. 3](#_bookmark10), the comminution from a parent rock (**S**<sub>0</sub>) undergoes cascading processes (e. g., **S**<sub>I</sub>, **S**<sub>II</sub>, …), where a subset, say {S<sub>I</sub>_<sub>k</sub>_} in **S**<sub>II</sub>, is generated by the frag- mentation of the grain _s_<sub>I</sub>_<sub>k</sub>_ in the preceding **S**<sub>I</sub>. On the other hand, the extra-fragments are supposed to come from a random process **S**<sub>ex</sub> and superposed to the cascading process.

- 1.  _Stochastic framework of the model_

Based on analysis of real soils one may get some insights into the processes. On one hand, the cascading fragmentation is similar to the fractal picture proposed for soil formation on earth ([Bittelli et al., 1999](#_bookmark22); [Martín and Taguas, 1998](#_bookmark49); [Perfect, 1993](#_bookmark57); [Perrier et al., 1999](#_bookmark58); [Rieu and](#_bookmark64) [Sposito, 1991](#_bookmark64); [Turcotte, 1986](#_bookmark78); [Tyler and Wheatcraft, 1992](#_bookmark79)), which leads

to the power-law distribution: _M_(_D_)/_M_<sub>T</sub> = (_D/D_<sub>max</sub>)<sup>3-</sup>_<sup>d</sup>_, with _M_(_D_)/_M_<sub>T</sub>

representing the mass fraction of grains up to _D_ in the total mass, _D_<sub>max</sub>

the maximum grain size, and _d_ the fractal dimension (about 2.30 ~ 2.70

for soils). The power-law distribution has also been used to mimic the impact and gardening processes of LS formation through geologic time (e.g., [Long-Fox et al., 2023](#_bookmark48)). Moreover, stone number on the moon appear to follow the same distribution (e.g., [Gromov, 1999](#_bookmark30)). Therefore, we take the fractal picture as representing the fragments from the cascading comminution. On the other hand, samples returned by CE-5 indicate the GSD of the glasses (both fine and coarse) are normally distributed ([Shen et al., 2024](#_bookmark70)). This suggests that we may use normal distribution to represent another source of grains for LS. And observa- tion of the textural diffusivity implies the this also applies to TS.

Then the fragment sources **S**<sub>E</sub> may be randomly generated by a power-law sequence and a normal sequence of grains, as illustrated in [Fig. 3](#_bookmark10). This provides the sources of grains covering the all the sizes present in soils (e.g., from 10 <sup>to</sup> <sup>3</sup> ~ 100 mm). We may also express the sequence **S**<sub>E</sub> as the union of the grades:

_n_

**S**<sub>E</sub> = ∪... ∪ ∪ **_S_**_<sub>Ij</sub>_ \= ∪ **S**_<sub>k</sub>_, **S**_<sub>k</sub>_ \= (_s<sub>k</sub>_<sub>—1</sub>, _s<sub>k</sub>_\], _k_ \= 1, 2, ..., _n_, _s_<sub>0</sub> = 0 (3)

other word, soil is a granular ensemble with invariance of {_ξ<sub>i</sub>_}following

_l k_<_lj_<_k_

_k_\=1

the same GSD function. The GSD-invariance of the grade space is the very quantitative and characteristic expression of the unity of soils. From the viewpoint of granular configuration, the formation of soil is simply amounting to the generation of the grade space. This sets up the background for our following simulation of soil genesis.

# Unified model of soil genesis

- 1.  _Schematic illustration of the model_

Beyond the disparate environments on earth and planetary bodies, both TS and LS (and MS) are formed by three principal processes: comminution/fragmentation, agglutination/aggregation, and mixing (e. g., [Heiken et al., 1991](#_bookmark34); [Legros, 2012](#_bookmark43); [Slyuta, 2014](#_bookmark74)). We simplify the

**Table 1**

Normal parameters (_η, σ_) for major textures of terrestrial and extraterrestrial soils.

here each subset **S**_<sub>k</sub>_ corresponds to a population of fragments in (_s<sub>k</sub>_<sub>\-1</sub>, _s<sub>k</sub>_\] (i.e., **e**_<sub>i</sub>_). Then the soil as granular ensemble is formed by randomly “taking” grains out of the grades. This can be expressed in form of

|     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- |
| Nor (_η, σ_) | Gravel (20 mm) | Sandy (2 mm) | Silty (0.05 mm) | Clay (0.002 mm) |     |
| XC  | 6.27, 4.25 | 16.18, 3.53 | 2.50, 0.92 | 3.22, 0.81 | **Fig. 3.** Schematic illustration of soil formation as a cascading process from rock |
| MLP | 1.12, 1.19 | 10.69, 4.38 | 8.40, 1.94 | 0.14, 0.14 | fragmentation. (a) The formation of TS; (b) Dominate processes of Lunar soil; |
| DF  | 14.88, 4.59 | 11.47, 5.36 | 3.42, 2.33 | 3.75, 3.06 | (c) The cascading process from rock to soils: a rock comminutes through stages |
| TMD | 21.75, 14.99 | 9.48, 3.70 | 0.71, 0.52 | 0.66, 0.51 | **S**<sub>I</sub> to **S**<sub>E</sub>, producing fragments that serve as sources for soil. Each element s<sub>I</sub>_<sub>k</sub>_ in **S**<sub>I</sub> |
| JSR | 10.37, 8.17 | 9.74, 7.70 | 1.50, 1.32 | 2.21, 0.95 | further comminutes into a group of fragments, denoted as {S<sub>I</sub>_<sub>k</sub>_}, in the suc- |

ceeding stage **S**<sub>II</sub>. The soil is formed through the random selection of fragments from the set **S**<sub>E</sub>.

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| Moon | N/A | 5.34, 4.67 | 5.95, 1.54 | 5.97, 6.81 |
| Mars | 21.97, 30.42 | 92.19, 20.29 | 0.32, 0.47 | N/A |

_M_(**e**_<sub>i</sub>_) = _ρ<sub>k</sub>m_(**S**_<sub>k</sub>_) (4)

∑

_k_∈**e**_i_

in which _M_(**e**_<sub>i</sub>_) (or simply, _M<sub>i</sub>_) is the mass of grade **e**_<sub>i</sub>_, determined by a set of random coefficients {_ρ<sub>k</sub>_}, and _m_(**S**_<sub>k</sub>_) means the sum of fragments contributing to grade **e**_<sub>i</sub>_. Considering the diffusivity of grades, {_ρ<sub>k</sub>_} can be taken as a normal variate. Finally, [Eq. (4)](#_bookmark11) derives the grade fraction _ξ<sub>i</sub>_

_ξ_ / ∑

_N_

_<sub>i</sub>_ \= _M<sub>i</sub> M<sub>i</sub>_(_i_ \= 1, 2, …, _N_) (5)

_i_

and this defines the grade space of soil ([Eq. (2)](#_bookmark7)).

- 1.  _Numerical generation of grade space_

- - 1.  _Simulation parameters_

In order to realize the scenario described by [Eq. (3)](#_bookmark8)\-[(5)](#_bookmark12), the first step is to generate the grain sources using the power-law and normal se- quences. For purpose of numerical simulation, the power-law distribu- tion should be normalized in the Pareto form:

_α_ — 1( _m_ )—_α_

function is a natural consequence from the randomness of soil genesis.

# (2)Evolution of grade space

The “randomly selecting” operation through [Eq. (4)](#_bookmark11) also represents the processes of soil evolution, which amounts to the rearrangement of grains, as occurring in processes of erosion and mass movements on earth, and the frequent overturn and comminution caused by small impacts on moon ([Richardson and Abramov, 2020](#_bookmark62)). The evolution in grade space is reduced to the _ξ_\-variation. By repeating the random _ρ_\-selection, we simulate soil evolution from state of mode-I to multi- modal states (II, III, and IV) ([Fig. 4](#_bookmark13)e), using the same sources of [Fig. 4](#_bookmark13)a. The dramatic shift of grade mode represents a long-term evolution (rather than transient changes), and predicts the chronosequence of soil over a large scale of space and time. This also accounts for the origin of diversity in granular configurations. More importantly, the GSD func- tion is preserved in all the evolving states of soils. in this sense, the soil evolution is a process of GSD-cycle.

In addition, the grade space is equipped with the “configuration entropy”, _H_\=- _ξ<sub>i</sub>_Ln_ξ<sub>I</sub>_; this is more sensitive to small variations in dis- order than parameters derived from fractal analyses ([Andraud et al.,](#_bookmark16)

∑

[1994](#_bookmark16)), and provides a measure for the grade variation. Note that _H_

decreases (e.g., from 2.20 to 1.63 on average) from mode-I to mode-IV. The grade variation occurs more remarkably in transient processes of

_p_(_m_) =

_m_

0 _m_0

(6)

mass movements on earth (e.g., soil failures, landslides, debris flows, and sediment transports), where one observes that _H_ becomes lower

where _m_<sub>0</sub> represents a cutoff to prevent the integral divergence of the power function ([Arnold, 2008](#_bookmark17); [Newman, 2005](#_bookmark53)). The integral of _p_(_m_) is _P_ (>_m_) ~ (_m/m_<sub>0</sub>)<sup>\-</sup>_<sup>α</sup>_<sup>+1</sup>, necessitating _α_ \> 1 for applications. Given proper _α_

and _m_<sub>0</sub>, we may get the fractal fragments. As for the fragments due to

other processes, they may be generated by normal distribution as mentioned above.

The key point in realizing the scenario is determining Pareto parameter (_α, m_<sub>0</sub>) and normal parameter (_η, σ_) to generate grains within the actual size range, e.g., in order of 0.0001 to 10 mm. Given _m_<sub>0</sub>, we find that upper limit of size (_D_<sub>max</sub>) varies little with _α_ between 1 and 3; and _D_<sub>max</sub> decreases with _α_ nearly in a power-law manner elsewhere. Then we select _α_ \=1.6 and 2.5 as representative for general cases, given

an arbitrary cutoff, e.g., _m_<sub>0</sub>\=4 (corresponding to _D_<sub>max</sub>~15 mm). Sub-

sequently, we abstract _m_<sub>0</sub> from the simulated mass to obtain the source fragments ([Fig. 4](#_bookmark13)a). As for the normal fragments, we simply use (2, 0.5) for representing the grains from various sources. These parameters, for examples, yield the fragment source as illustrated by the sequences in [Fig. 4](#_bookmark13)a.

- - 1.  _Simulation results_

Given the fragments (e.g., [Eq. (3)](#_bookmark8)), it is easy to obtain the grade space ([Eq. (4) and 5](#_bookmark11)) through the selection coefficient _ρ<sub>i</sub>_ (>0) by normal random number (e.g., [Atkinson and Pearce, 1976](#_bookmark19); [Law, 2014](#_bookmark44)). For convenience, we take **e**_<sub>i</sub>_ as the sieving grades and thus _ξ<sub>i</sub>_ \= _p<sub>i</sub>_ and thus the grades are comparable with the real soils. Following the scenario of

[Fig. 3](#_bookmark10), the simulation results are obtained and some are presented in [Fig. 4](#_bookmark13). In this figure, we have considered three cases:

(1)Generation of grade space and GSD function

The sources (Fir. 4a) mixed with grains produced by processes of the Pareto (1.6, 4) and Norm (2, 0.5) yield panel [Fig. 4](#_bookmark13)b, including the observed grade modes (A1-A4) comparing with the real samples of TS and LS. For more convincing, we use an alternative Pareto (2.5, 4) to replace the cascading comminution and obtain panel [Fig. 4](#_bookmark13)c for another group of grade modes (B1-B4). It is noted that the grade modes are insensitive to the parameters used for generating the sources. This suggests that the stochastic model has captured the fundamental feature underlying the soils as granular ensemble independent of the specific mechanisms of comminution and impacts.

Moreover, the grade modes spontaneously derive the unified GSD function ([Fig. 4](#_bookmark13)d), with the same curve _g_(_μ_) = _b_exp(-_aμ_) as the real soils (cf. [Fig. 2](#_bookmark6)h). Thus the proposed model provides a mechanism for the

emergence of the unified GSD function. In other words, the unified GSD

from slope sources to the sediment flows and deposits; because the dynamical effects in granular ensemble have outweighed the entropy increase effect (e.g., [Jaeger et al., 1996](#_bookmark39)). In comparison, the fractal dimension (if applied) varies between 2.30 ~ 2.70 without any tendency with the evolution. As these processes are ubiquitous on the moon and even on Mars and Venus ([Ganesh et al., 2021](#_bookmark28); [Waltham et al., 2008](#_bookmark81); [Wilson and Head, 1983](#_bookmark82)), the GSD-entropy applies generally to evolution of extraterrestrial soils.

# Discussions: application and implication of the GSD-unity

- 1.  _Unified indicators for soil classifications_

The unified GSD function maps the grade space {_ξ<sub>i</sub>_}(or {_p<sub>i</sub>_}) to a parameter pair (_μ, D_<sub>c</sub>) and converts a set of texture fractions (and other measured factors) to a 2-dimensional picture. It is easy to find that _μ_ and _D_<sub>c</sub> respectively represent the fine and coarse content: _μ_ dominates as _P_

(_D_) ~ _D<sup>\-μ</sup>_ when _D<<D_<sub>c</sub>, while _D_<sub>c</sub> features the coarse end of the texture because _P_(_D_<sub>c</sub>) is typically small (e.g., <10 %) ([Fig. 2](#_bookmark6)g). When plotted in the (_μ, D_<sub>c</sub>) space, soils cluster in distinct groups ([Fig. 5](#_bookmark14)). Fine soils (either TS, LS, or MS) cover a wide range of _μ_, and coarse soils are concentrated

densely within a narrow range, with wide range of _D_<sub>c</sub>. As (_μ, D_<sub>c</sub>)-vari- ation responds to the changes in grade space {_ξ<sub>i</sub>_}, it is possible to predict soil changes, e.g., in surface processes both on earth and planetary bodies. Through stochastic simulation, even with only a limited dataset available as the probability basis.

The GSD parameters also carry genesis information. For example, _μ_ acts as an index for LS maturity. As shown in [Fig. 5](#_bookmark14), the Apollo samples with different modes (cf. [Fig. 2](#_bookmark6)) fall into distinct _μ_\-value ranges: unim- odal (0.028, 0.113), bimodal (0.005, 0.056), and trimodal (—0.008, 0.048). This suggests that even in the same sites there are soils of different maturity.

Furthermore, soils from Apollo and CE-5 cluster in the same group but differ greatly from the CE-6, which falls into the MS group (Inset in [Fig. 5](#_bookmark14)). This coincides with the observation that CE-6 soils have lower density than the others ([Li et al., 2024](#_bookmark46)), which might be associated with the CE-6 sites (farside of the moon) of higher abundance of low-density plagioclase and glass and the lower abundance of olivine. It is also possible that CE-6 soils have suffered from mixing the with the freshly ejected components with exotic materials (e.g., distal ejecta) (e.g., [Li](#_bookmark46) [et al., 2024](#_bookmark46)).

**Fig. 4.** Simulation of grade space of soil from fractal fragments. (a) Fragment mass sequence generated by Pareto distribution, with parameters _α_ \= 1.6 and _m_<sub>0</sub> =4 (S<sub>E</sub>\-A) and _α_ \= 2.5 and _m_<sub>0</sub> =18 (S<sub>E</sub>\-B). (b) and (c) The generated frequency curves with different grade modes (unimodal, bimodal, trimodal, and multimodal) from

S<sub>E</sub>\-A and S<sub>E</sub>\-B. (d) Evolution of grade modes (from I to IV) simulated by repeating the generation procedure. (e) and (f) The unified GSD curves emerging from the grade modes, with the same _g_(_μ_) curves. Each mode is compared with soil samples.

**Fig. 5.** GSD parameters (_μ, D_<sub>c</sub>) presenting a new classification of soil. Seven clusters of (_μ, D_<sub>c</sub>) point are presented here, respectively representing fine soils Hor (Horqin grassland of China), Fin (Forest land of Finland) and Nev (desert soils of Nevada, US); vegetated soils XC and MLP; materials of surface process (spm) (e.g., landslides, debris flow, and sediment transport); and samples of LS (Apollo and Chang’E) and MS (Inset).

- 1.  _GSD-based numerical simulants for LS_

LS simulants are increasingly used in the study of lunar sciences and engineering. However, existing simulants are only satisfactory for spe- cial purposes based on the mechanical crumbling of terrestrial rocks (e. g., mare simulants using rocks of basaltic composition while highland simulants using anorthosites with an admixture of olivine and pyroxene) ([Slyuta, 2014](#_bookmark74); [Zou et al., 2024](#_bookmark93)); usually they achieve only the similarity in coarse content, and the fine content requires substantial efforts and high cost of technologies.

The GSD-function has laid the foundation for creating “numerical simulants”, i.e., numerically simulating LS based on the granular configuration in terms of (_μ, D_<sub>c</sub>) and deriving the related properties with comparison and calibration to the experimental results. For examples, the standard references simulants LHS-1 and LMS-1 (e.g., [Long-Fox](#_bookmark48) [et al., 2023](#_bookmark48)) were aimed to replicate the GSD of the returned LS as presented in the catalog ([Graf, 1993](#_bookmark29)), and Mohr-Coulomb failure crite- rion and mass flow tests are applied to them just as they are applied to TS and surface processes on earth. It is possible to express the LS properties as function of (_μ, D_<sub>c</sub>) as we do for TS by using experiments and machine learning method (e.g., [Jiang et al., 2024](#_bookmark40)). This would greatly extend the production and utilization of LS simulants. Moreover, the GSD-simulants are expected to be helpful in establishing the simulant standard based on their universality and variability.

- 1.  _Granular fields of soils_

The unified GSD makes it possible to create parameter field of _μ_ or _D_<sub>c</sub>, which refines the conventional high-dimensional data map. Since most soil properties (e.g., porosity, permeability, diffusivity, and shear strength) are determined by fine content ([Hatheway et al., 1996](#_bookmark33)), we may consider only _μ_ in many cases. On small scale (e.g., a sampled site of 1~100m<sup>2</sup>), the _μ-_field is directly determined through site sampling ([Fig. 6](#_bookmark15)a); and based on the site-specific field one may randomly generate the grade space by the classical Bayesian Monte Carlo methods, and extend the field to a slope or a small watershed ([Fig. 6](#_bookmark15)b), with the unit

cell relying only on the resolution of the Digital Terrain Model (DTM), which might be as high as 0.05 m × 0.05 m, generated by Unmanned Aerial Vehicle (UAV) (e.g., [Zhang et al., 2022](#_bookmark88)). Applying this operation

to ever-increasing area one may obtain the field at large scale, as shown by [Fig. 6](#_bookmark15)c for the Transverse Mountains (4.36 × 10<sup>5</sup> km<sup>2</sup>) in southwest China, at resolution of 100 m.

GSD-field also applies to the moon. As shown in [Fig. 6](#_bookmark15), _μ-_fields are created for three small areas representing the sampling sites of mare (Apollo 11), highland (Apollo 16), and basin margin (Apollo 15). Obviously, the three fields present distinctive patterns of _μ-_distribution, i.e., the spatial concentration of fine grains over the area. This reveals the size separation of fine and coarse grains and accounts for the vari- ability of the material composition.

Prospectively, the GSD-field leads to a new paradigm of soil study, in contrast to the conventional soil-landscape paradigm based on the dig- ital data mapping. The GSD-field has the superiority of propagating local heterogeneity from one site to other sites and upscaling the data to large areas. Moreover, the GSD-fields may further derive fields of soil prop- erties based on transfer function _f_(_μ, D_<sub>c</sub>) (e.g., [Zhang et al., 2022](#_bookmark91); [Jiang](#_bookmark40) [et al., 2024](#_bookmark40)). This facilitates extending local processes (erosion, soil failures, and mass movements) to large scale. In comparison, the con- ventional digital soil maps give only type data (even at high resolution); this smooths out spatial fluctuation at small scale and does not suffice to provide data support for study of the local processes.

- 1.  _Prospect of GSD in ISRU_

The GSD-fields are possible to develop the 3D maps of regolith based on the intimate connection between GSD and the regolith thickness and the 3D digital model for the topography of the moon surface ([Binnie](#_bookmark21) [et al., 2019](#_bookmark21)). This would facilitate the ISRU in its burgeoning stage.

As mentioned above, the GSD-field might reveal segregation of fine and coarse grains, distinguish (indirectly) composites (e.g., ilmenite, agglutinitic and pyroclastic glass, olivine, and pyroxene), these are important for identifying potential sources and preparing suitable feedstock for oxygen production from regolith ([Schreiner et al., 2016](#_bookmark68); [Schwandt et al., 2012](#_bookmark69)). Generally, ISRU in planetary bodies requires the synthesis of excavation, beneficiation, and extraction ([Hadler et al.,](#_bookmark32) [2019](#_bookmark32); [Rasera et al., 2020](#_bookmark61)), the GSD method would bridge the gaps be- tween the various fields.

Moreover, the upscaling of GSD-field provides a new tool of analyzing geotechnical properties of LS (or regolith on Mars and Venus) for the base construction.

# Conclusion

Soils on earth and moon (and even Mars and other terrestrial plan- etary bodies) universally satisfy a unified GSD function, _P_(_D_) = _g_(_μ_)_D<sup>\-</sup> μ_exp(-_D/D_<sub>c</sub>). This means soils are unified in granular configuration with

GSD-invariance. We simplify soils as granular ensembles and formulate a conceptual framework of soil genesis through random aggregation of fractal fragmentation from the parent lithospheric materials (e.g., rocks) and fragments from other sources (e.g., meteorites impact), and numerically realize the scenario to generate the grade space (a geo- metric generalization of the texture) that spontaneously derives the unified GSD function. The GSD-unity reduces soil genesis and surface processes on planetary bodies to the process of GSD cycles.

The GSD function has realized the mapping from the texture frac- tions {_ξ<sub>i</sub>_} to two universal parameters, _μ_ and _D_<sub>c</sub>. This data-basis con- version reduces the conventional high-dimensional data of soil into low- dimensional codes, facilitating the classification, visualization, communication, data storage, and transfer functions for soil properties; and this initiates a GSD-paradigm, in contrast to the conventional soil- landscape paradigm generally adopted in soil studies. In this new paradigm, the soils are classified by the GSD pair (_μ, D_<sub>c</sub>), in which various soils (with different grade modes or densities), and soils in different surface processes, are clustered in distinct groups. Moreover, LS simulants can be numerically created by the GSD parameters and their properties as function of (_μ, D_<sub>c</sub>) can be established through

**Fig. 6.** GSD-fields of TS and LS. Upper: (a) _μ_\-field for a sampling site; (b) _μ_\-field extended to a small watershed (0.51 km<sup>2</sup>) at a resolution of 0.05 m, based on UAV- derived DTM; (c) _μ-_field extended to the Transverse Mountains (4.36 × 10<sup>5</sup> km<sup>2</sup>) in southwest China, at a resolution of 100 m; (d) Sampling sites of Apollo 11, 15, and 16; (e) _μ_\-field of the mare (27 cm × 54 cm) near Apollo-11; (f)_μ_\-field of the highland (30 cm × 30 cm) near Apollo 16; (g) _μ_\-field of the basin margin (63 cm × 63 cm) near Apollo 15.

numerical experiments and machine learning methods. This would supplement or substitute the material simulants of LS.

Furthermore, the it is possible to create (_μ, D_<sub>c</sub>)-fields for soils across

scales both on earth and moon. The GSD-fields are superior in that they quantitatively depict the local fluctuation of soil parameters and can propagate the local fluctuation to large scale, which remedy the defects of the digital mapping based on averaged measurements and are ex- pected to bridge the gap between studies of soil genesis and dynamics. The GSD-fields may distinguish soils between areas (i.e., mares, high- lands, and basin margins) and helps establish the 3D data for LS regolith, which is significant for the ISRU and base construction for the future extraterrestrial exploration.

# CRediT authorship contribution statement

**Jun Zhang:** Writing – original draft, Validation, Supervision, Methodology, Formal analysis, Data curation, Conceptualization. **Yong Li:** Writing – review & editing, Supervision, Funding acquisition. **Yifei Cui:** Visualization, Supervision, Resources. **Zi Wu:** Writing – review & editing, Supervision, Resources. **Yuan Xue:** Supervision, Methodology, Investigation. **Jianyi Cheng:** Software, Methodology, Investigation. **Hu Jiang:** Software, Methodology. **Yao Li:** Resources, Data curation, Conceptualization. **Jian Guo:** Writing – review & editing, Formal analysis, Data curation. **Jiayan Nie:** Writing – review & editing, Re- sources, Conceptualization. **Guodong Wang:** Validation, Supervision, Resources. **Ao Luo:** Validation, Resources, Methodology.

# Declaration of competing interest

The authors declare that they have no known competing financial interests or personal relationships that could have appeared to influence the work reported in this paper.

# Acknowledgements

This research is supported by the China Postdoctoral Science Foun- dation (No. 2023M741997), the National Natural Science Foundation of China (42241109 and 42202297), the China National Postdoctoral Program for Innovation Talent (No. GZC20231347), the National Key R&D Program of China (2021YFC3200402), and the National Natural Science Foundation of China (No.42322703, 42271092).

# Supplementary material

Data sources are described at [https://data.mendeley.com/datasets/](https://data.mendeley.com/datasets/7n6pmzbyr6/2) [7n6pmzbyr6/2](https://data.mendeley.com/datasets/7n6pmzbyr6/2) ([Zhang, 2025](#_bookmark89)), and data for soil classification of Trans- verse Mountains is available at [http://geodata.pku.edu.cn](http://geodata.pku.edu.cn/).

Supplementary material associated with this article can be found, in the online version, at [doi:10.1016/j.epsl.2025.119239](https://doi.org/10.1016/j.epsl.2025.119239).

# Data availability

Data will be made available on request.

# References

Andraud, C., Beghdadi, A., Lafait, J., 1994. Entropic analysis of random morphologies.

Physica A 207, 208–212. [https://doi.org/10.1016/0378-4371(94)90374-3](https://doi.org/10.1016/0378-4371%2894%2990374-3).

[Arnold, B.C., 2008. Pareto and generalized Pareto distributions. Modeling Income](http://refhub.elsevier.com/S0012-821X%2825%2900038-X/sbref0002) [Distributions and Lorenz curves. Springer New York, New York, NY, pp. 119–145](http://refhub.elsevier.com/S0012-821X%2825%2900038-X/sbref0002).

Arslan, H., Batiste, S., Sture, S., 2010. Engineering properties of lunar soil simulant JSC- 1A. J. Aerosp. Eng. 23 (1), 70–83. https://doi.org/10.1061/(ASCE)0893-1321

(2010)23:1(70).

Atkinson, A.C., Pearce, M.C., 1976. The computer generation of beta, gamma and normal random variables. J. Royal Statist. Society: Series A (General) 139 (4), 431–448. https://doi.org/10.2307/2344349.

Battler, M.M., Spray, J.G., 2009. The Shawmere anorthosite and OB-1 as lunar highland regolith simulants. Planet. Space Sci. 57 (14–15), 2128–2131. [https://doi.org/](https://doi.org/10.1016/j.pss.2009.09.003) [10.1016/j.pss.2009.09.003](https://doi.org/10.1016/j.pss.2009.09.003).

Binnie, S.A., Nishiizumi, K., Welten, K.C., Caffee, M.W., Hoffmeister, D., 2019. Lunar surface processes inferred from cosmogenic radionuclides in Apollo 16 double drive core 68002/68001. Geochim. Cosmochim. Acta 244, 336–351. [https://doi.org/](https://doi.org/10.1016/j.gca.2018.09.036) [10.1016/j.gca.2018.09.036](https://doi.org/10.1016/j.gca.2018.09.036).

Bittelli, M., Campbell, G.S., Flury, M., 1999. Characterization of particle-size distribution in soils with a fragmentation model. Soil Sci. Soc. Am. J. 63 (4), 782–788. [https://](https://doi.org/10.2136/sssaj1999.634782x) [doi.org/10.2136/sssaj1999.634782x](https://doi.org/10.2136/sssaj1999.634782x).

Carrier III, W.D., 2003. Particle size distribution of lunar soil. J. Geotech. Geoenviron. Eng. 129 (10), 956–959. https://doi.org/10.1061/(ASCE)1090-0241(2003)129:10

(956).

Chaney, N.W., Minasny, B., Herman, J.D., Nauman, T.W., Brungard, C.W., Morgan, C.L., Yimam, Y., 2019. POLARIS soil properties: 30-m probabilistic maps of soil properties over the contiguous United States. Water Resour. Res. 55 (4), 2916–2938. [https://](https://doi.org/10.1029/2018WR022797) [doi.org/10.1029/2018WR022797](https://doi.org/10.1029/2018WR022797).

Chaney, N., Wood, E.F., Hempel, J., McBratney, A.B., Nauman, T.W., Brungard, C., Odgers, N.P., 2016. POLARIS: a 30-meter probabilistic soil series map of the contiguous United States. Geoderma 274, 54–67. [https://doi.org/10.1016/j.](https://doi.org/10.1016/j.geoderma.2016.03.025) [geoderma.2016.03.025](https://doi.org/10.1016/j.geoderma.2016.03.025).

Chaney, N.W., Roundy, J.K., Herrera-Estrada, J.E., Wood, E.F., 2015. High-resolution modeling of the spatial heterogeneity of soil moisture: applications in network design. Water Resour. Res. 51 (1), 619–638. [https://doi.org/10.1002/](https://doi.org/10.1002/2013wr014964) [2013wr014964](https://doi.org/10.1002/2013wr014964).

Easter, P., Long-Fox, J., Britt, D., Brisset, J., 2024. The effect of particle size distribution on lunar regolith simulant angle of repose. Adv. Space Res. 74 (7), 3437–3447. https://doi.org/10.1016/j.asr.2024.06.042.

Ganesh, I., McGuire, L.A., Carter, L.M., 2021. Modeling the dynamics of dense pyroclastic flows on Venus: insights into pyroclastic eruptions. J. Geophys. Res.: Planets 126, e2021JE006943. https://doi.org/10.1029/2021JE006943.

[Graf, J.C., 1993. Lunar Soils Grain Size Catalog (No. NASA-RP-1265)](http://refhub.elsevier.com/S0012-821X%2825%2900038-X/sbref0014).

Gromov, V., 1999. Physical and Mechanical Properties of Lunar and Planetary Soils.

Earth, Moon and Planet 80, 51–72. https://doi.org/10.1007/978-94-011-4728-6_5. Guo, D., Bao, Y., Liu, Y., Wu, X., Xu, Y., Yang, Y., Zhang, F., Jolliff, B., Li, S., Zhao, Z., Huang, L., Liu, J., Zou, Y., 2024. Geological investigation of the lunar Apollo basin: from surface composition to interior structure. Earth Planet. Sci. Lett. 646 (118986).

https://doi.org/10.1016/j.epsl.2024.118986.

[Hadler, K., Martin, D.J.P., Carpenter, J., Cilliers, J.J., 2019. A universal flowsheet and](http://refhub.elsevier.com/S0012-821X%2825%2900038-X/sbref0017) [terminology for in situ resource utilization (ISRU). In: 50th Annual Lunar and](http://refhub.elsevier.com/S0012-821X%2825%2900038-X/sbref0017) [Planetary Science Conference, 2132, p. 2609](http://refhub.elsevier.com/S0012-821X%2825%2900038-X/sbref0017).

Hatheway, A.W., 1996. Soil mechanics in engineering practice. Environ. Eng. Geosci. II (3), 444–446. https://doi.org/10.2113/gseegeosci.II.3.444.

[Heiken, G., Vaniman, D., French, B.M., Schmitt, J., 1991. Lunar Sourcebook. A User’s](http://refhub.elsevier.com/S0012-821X%2825%2900038-X/sbref0019) [Guide to the Moon, Cambridge, UK](http://refhub.elsevier.com/S0012-821X%2825%2900038-X/sbref0019).

Hudson, B.D., 1992. The soil survey as paradigm-based science. Soil Sci. Soc. Am. J. 56 (3), 836–841. [https://doi.org/10.2136/sssaj1992.03615995005600030027x](https://doi.org/10.2136/sssaj1992.03615995005600020005x).

Hudson, B.D., 1990. Concepts of Soil Mapping and Interpretation. Soil Horizons 31 (3),

63\. https://doi.org/10.2136/sh1990.3.0063.

Isachenkov, M., Chugunov, S., Smirnov, A., Kholodkova, A., Akhatov, I., Shishkovsky, I., 2022. The effect of particle size of highland and mare lunar regolith simulants on their printability in vat polymerisation additive manufacturing. Ceram. Int. 48 (23), 34713–34719. https://doi.org/10.1016/j.ceramint.2022.08.060.

Iverson, R.M., 1997. The physics of debris flows. Rev. Geophys. 35 (3), 245–296. [https://](https://doi.org/10.1029/97RG00426) [doi.org/10.1029/97RG00426](https://doi.org/10.1029/97RG00426).

Jaeger, H.M., Nagel, S.R., Behringer, R.P., 1996. Granular solids, liquids, and gases. Rev.

Mod. Phys. 68 (4), 1259. https://doi.org/10.1103/RevModPhys.68.1259.

Jiang, H., Li, Y., Zou, Q., Zhang, J., Cui, J., Cheng, J., Yao, H., 2024. A GSD-driven approach to deriving stochastic soil strength parameters under hybrid machine learning models. Eur. J. Soil Sci. 75 (6), e70009. [https://doi.org/10.1111/](https://doi.org/10.1111/ejss.70009) [ejss.70009](https://doi.org/10.1111/ejss.70009).

Koster, R.D., Suarez, M.J., Ducharne, A., Stieglitz, M., Kumar, P., 2000. A catchment- based approach to modeling land surface processes in a general circulation model 1. Model structure. J. Geophys. Res. 105 (D20), 809–824. [https://doi.org/10.1029/](https://doi.org/10.1029/2000jd900327) [2000jd900327](https://doi.org/10.1029/2000jd900327), 24822.

Landsman, Z.A., Schultz, C.D., Britt, D.T., Peppin, M., Kobrick, R.L., Metzger, P.T., Orlovskaya, N., 2021. Phobos regolith simulants PGI-1 and PCA-1. Adv. Space Res. 67, 3308–3327. https://doi.org/10.1016/j.asr.2021.01.024.

[Law, A.M., 2014. Simulation Modeling and Analysis. McGraw-Hill Education, New York](http://refhub.elsevier.com/S0012-821X%2825%2900038-X/sbref0028). [Legros, J.-P., 2012. Major Soil Groups of the World Ecology, Genesis, Properties and](http://refhub.elsevier.com/S0012-821X%2825%2900038-X/sbref0029)

[Classification. CRC Press, Taylor and Francis Group, LLC, New York](http://refhub.elsevier.com/S0012-821X%2825%2900038-X/sbref0029).

Li, Y., Huang, C.M., Wang, B.L., Tian, X.F., Liu, J.,.J., 2017. A unified expression for grain size distribution of soils. Geoderma 288, 105–119. [https://doi.org/10.1016/j.](https://doi.org/10.1016/j.geoderma.2016.11.011) [geoderma.2016.11.011](https://doi.org/10.1016/j.geoderma.2016.11.011).

Li, C.L., Hu, H., Yang, M.F., Liu, J., Zhou, Q., Ren, X., Liu, B., Liu, D., Zeng, X.G., Zuo, W.,

Zhang, Z., Zhang, H.B., Yang, S., Wang, Q., Deng, X.J., Gao, X., Su, Y., Wen, W.B., Ouyang, Z.Y., 2024. Nature of the lunar far-side samples returned by the Chang’E-6 mission. Natl. Sci. Rev. 11, nwae328. https://doi.org/10.1093/nsr/nwae328.

Liu, T., Michael, G., Zuschneid, W., Wünnemann, K., Oberst, J., 2020. Lunar megaregolith mixing by impacts: evaluation of the non-mare component of mare soils. Icarus 358, 114206. https://doi.org/10.1016/j.icarus.2020.114206.

Long-Fox, J.M., Landsman, Z.A., Easter, P.B., Millwater, C.A., Britt, D.T., 2023.

Geomechanical properties of lunar regolith simulants LHS-1 and LMS-1. Adv. Space Res. 71 (12), 5400–5412. https://doi.org/10.1016/j.asr.2023.02.034.

Martín, A.M., Taguas, J.F., 1998. Fractal modelling, characterization and simulation of particle-size distributions in soil. Proceed. Royal Society of London. Series A: Math., Phys. Eng. Sci. 454 (1973), 1457–1468. https://doi.org/10.1098/rspa.1998.0216.

Martin, D.J., Hanna, K.L.D., Joy, K.H., Gillis-Davis, J.J., 2022. A petrological and spectral characterisation of the NU-LHT-2M lunar highlands regolith simulant in preparation

for the PROSPECT test campaign. Planet. Space Sci. 221, 105561. [https://doi.org/](https://doi.org/10.1016/j.pss.2022.105561) [10.1016/j.pss.2022.105561](https://doi.org/10.1016/j.pss.2022.105561).

[McKay, D.S., Carter, J.L., Boles, W.W., Allen, C.C., Allton, J.H., 1994. JSC-1: a new lunar](http://refhub.elsevier.com/S0012-821X%2825%2900038-X/sbref0036) [soil simulant. Eng., Construct., Operat. Space IV 2, 857–866](http://refhub.elsevier.com/S0012-821X%2825%2900038-X/sbref0036).

[McKay, D.S., Basu, A., Waits, G., 1978. Grain size and the evolution of Luna 24 soils.](http://refhub.elsevier.com/S0012-821X%2825%2900038-X/sbref0037)

[Mare Crisium: the View from Luna 24, 125–136](http://refhub.elsevier.com/S0012-821X%2825%2900038-X/sbref0037).

Newman, M.E., 2005. Power laws, Pareto distributions and Zipf’s law. Contemp. Phys. 46 (5), 323–351. https://doi.org/10.1080/00107510500052444.

Niu, G.-Y., Yang, Z.-L., Mitchel, K.E., Chen, F., Ek, M., Barlage, M., et al., 2011. The community Noah land surface model with multiparameterization options (NOAH- MP): 1. Model description and evaluation with local-scale measurements.

J. Geophys. Res. 116, D12109. https://doi.org/10.1029/2010JD015139.

Ohtake, M., Matsunaga, T., Haruyama, J., Yokota, Y., Morota, T., Honda, C., Ogawa, Y., Torii, M., Miyamoto, H., Arai, T., Hirata, N., Iwasaki, A., Nakamura, R., Hiroi, T., Sugihara, T., Takeda, H., Otake, H., Pieters, C.M., Saiki, K., Kitazato, K., Abe, M., Asada, N., Demura, H., Yamaguchi, Y., Sasaki, S., Kodama, S., Terazono, J., Shirao, M., Yamaji, A., Minami, S., Akiyama, H., Josset, J.L., 2009. The global distribution of pure anorthosite on the Moon. Nature 461, 236–241. [https://doi.org/](https://doi.org/10.1038/Nature08317) [10.1038/Nature08317](https://doi.org/10.1038/Nature08317).

Paton, T.R., 2023. Soils: A New Global View. CRC Press. [https://doi.org/10.1201/](https://doi.org/10.1201/9781003420361) [9781003420361](https://doi.org/10.1201/9781003420361).

Perfect, E., Kay, B.D., Rasiah, V., 1993. Multifractal model for soil aggregate fragmentation. Soil Sci. Soc. Am. J. 57 (4), 896–900. [https://doi.org/10.2136/](https://doi.org/10.2136/sssaj1993.03615995005700040003x) [sssaj1993.03615995005700040003x](https://doi.org/10.2136/sssaj1993.03615995005700040003x).

Perrier, E., Bird, N., Rieu, M., 1999. Generalizing the fractal model of soil structure: the pore–solid fractal approach. Geoderma 88 (3–4), 137–164. [https://doi.org/10.1016/](https://doi.org/10.1016/s0016-7061%2898%2900102-5) [s0016-7061(98)00102-5](https://doi.org/10.1016/s0016-7061%2898%2900102-5).

Pieters, C.M., Noble, S.K., 2016. Space weathering on airless bodies. J. Geophys. Res.: Planets 121 (10), 1865–1884. https://doi.org/10.1002/2016JE005128.

Porporato, A., D’odorico, P., Laio, F., Ridolfi, L., Rodriguez-Iturbe, I., 2002.

Ecohydrology of water-controlled ecosystems. Adv. Water Resour 25 (8–12), 1335–1348. [https://doi.org/10.1016/s0309-1708(02)00058-1](https://doi.org/10.1016/s0309-1708%2802%2900058-1).

Rasera, J.N., Cilliers, J.J., Lamamy, J.A., Hadler, K., 2020. The beneficiation of lunar regolith for space resource utilisation: a review. Planet. Space Sci. 186, 104879. https://doi.org/10.1016/j.pss.2020.104879.

Richardson, J.E., Abramov, O., 2020. Modeling the formation of the lunar upper megaregolith layer. The Planetary Science Journal 1 (1), 2. [https://doi.org/](https://doi.org/10.3847/PSJ/ab7235) [10.3847/PSJ/ab7235](https://doi.org/10.3847/PSJ/ab7235).

Rickman, D., Immer, C., Metzger, P., Dixon, E., Pendleton, M., Edmunson, J., 2012.

Particle shape in simulants of the lunar regolith. J. Sediment. Res. 82 (11), 823–832. https://doi.org/10.2110/jsr.2012.69.

Rieu, M., Sposito, G., 1991. Fractal fragmentation, soil porosity, and soil water properties: I. Theory. Soil Sci. Society of Am. J. 55 (5), 1231–1238. [https://doi.org/](https://doi.org/10.2136/sssaj1991.03615995005500050006x) [10.2136/sssaj1991.03615995005500050006x](https://doi.org/10.2136/sssaj1991.03615995005500050006x).

Sahu, A., Mandal, A., Banerjee, S., Panda, J., 2024. Insights into Martian bedform migration: results from Gale, Jezero and Pasteur craters. Earth Surface Processes and Landforms. https://doi.org/10.1002/esp.6013.

[Schaetzl, R.J., Anderson, S., 2005. Soils. Genesis and Geomorphology. Cambridge](http://refhub.elsevier.com/S0012-821X%2825%2900038-X/sbref0051) [University Press, New York](http://refhub.elsevier.com/S0012-821X%2825%2900038-X/sbref0051).

Schrader, C.M., Rickman, D.L., McLemore, C.A., & Fikes, J.C., 2010. Lunar regolith simulant user’s guide (No. M-1295).

Schreiner, S.S., Dominguez, J.A., Sibille, L., Hoffman, J.A., 2016. Thermophysical property models for lunar regolith. Adv. Space Res. 57 (5), 1209–1222. [https://doi.](https://doi.org/10.1016/j.asr.2015.12.035) [org/10.1016/j.asr.2015.12.035](https://doi.org/10.1016/j.asr.2015.12.035).

Schwandt, C., Hamilton, J.A., Fray, D.J., Crawford, I.A., 2012. The production of oxygen and metal from lunar regolith. Planet. Space Sci. 74 (1), 49–56. [https://doi.org/](https://doi.org/10.1016/j.pss.2012.06.011) [10.1016/j.pss.2012.06.011](https://doi.org/10.1016/j.pss.2012.06.011).

Shen, L., Zhao, R., Chang, C., Shen, L., Zhao, R., Chang, C., Yu, J., Xiao, D., Bai, H., Zou, Z., Yang, M., Wang, W., 2024. Separate effects of irradiation and impacts on lunar metallic iron formation observed in Chang’e-5 samples. Nat. Astron. 8 (9), 1110–1118. https://doi.org/10.1038/s41550-024-02300-0.

Shangguan, W., Dai, Y., Duan, Q., Liu, B., Yuan, H., 2014. A global soil data set for earth system modeling. J. Adv. Model. Earth Syst. 6 (1), 249–263. [https://doi.org/](https://doi.org/10.1002/2013ms000293) [10.1002/2013ms000293](https://doi.org/10.1002/2013ms000293).

Shi, X., Yu, D., Warner, E.D., Pan, X., Petersen, G.W., Gong, Z., and Weindorf, D.C., 2004.

Soil Database of 1:1,000,000 Digital Soil Survey and Reference System of the

Chinese Genetic Soil Classification System. Soil Horizons, 45, 129–136. [https://doi.](http://doi.org/10.2136/sh2004.4.0129) [org/10.2136/sh2004.4.0129](http://doi.org/10.2136/sh2004.4.0129).

[Sibille, L., Carpenter, P., Schlagheck, R., French, R.A., 2006. Lunar Regolith Simulant](http://refhub.elsevier.com/S0012-821X%2825%2900038-X/sbref0058) [Materials: Recommendations for Standardization, Production, and Usage. Technical](http://refhub.elsevier.com/S0012-821X%2825%2900038-X/sbref0058) [Publication TP2006214605. NASA](http://refhub.elsevier.com/S0012-821X%2825%2900038-X/sbref0058).

Slyuta, E.N., 2014. Physical and mechanical properties of the lunar soil (a review). Sol.

Syst. Res. 48 (5), 330–353. https://doi.org/10.1134/S0038094614050050.

Subin, Z.M., Milly, P.C., Sulman, B.N., Malyshev, S., Shevliakova, E., 2014. Resolving terrestrial ecosystem processes along a subgrid topographic gradient for an earth- system model. Hydrol. Earth Syst. Sci. Discuss. 11 (7), 8443–8492. [https://doi.org/](https://doi.org/10.5194/hessd-11-8443-2014) [10.5194/hessd-11-8443-2014](https://doi.org/10.5194/hessd-11-8443-2014).

Taylor, L.A., Pieters, C.M., Britt, D., 2016. Evaluations of lunar regolith simulants. Planetary & Space Sci. 126, 1–7. https://doi.org/10.1016/j.pss.2016.04.005.

Tsuchiyama, A., Uesugi, M., Matsushima, T., Michikami, T., Kadono, T., Nakamura, T., Kawaguchi, J., 2011. Three-dimensional structure of hayabusa samples: origin and evolution of Itokawa regolith. Science 333 (6046), 1125–1128. [https://doi.org/](https://doi.org/10.1126/science.1207807) [10.1126/science.1207807](https://doi.org/10.1126/science.1207807).

Turcotte, D.L., 1986. Fractals and fragmentation. J. Geophys. Res.: Solid Earth 91 (B2), 1921–1926. https://doi.org/10.1029/jb091ib02p01921.

Tyler, S.W., Wheatcraft, S.W., 1992. Fractal scaling of soil particle-size distributions: analysis and limitations. Soil Sci. Soc. Am. J. 56 (2), 362–369. [https://doi.org/](https://doi.org/10.2136/sssaj1992.03615995005600020005x) [10.2136/sssaj1992.03615995005600020005x](https://doi.org/10.2136/sssaj1992.03615995005600020005x).

Ueda, T., Matsushima, T., Yamada, Y., 2010. Effect of grain size distribution on mechanical properties of lunar soil. In: 12th Biennial International Conference on Engineering, Construction, and Operations in Challenging Environments; and Fourth NASA/ARO/ASCE Workshop on Granular Materials in Lunar and Martian Exploration, pp. 49–56. [https://doi.org/10.1061/41096(366)7](https://doi.org/10.1061/41096%28366%297).

Waltham, D., Pickering, K.T., Bray, V.J., 2008. Particulate gravity currents on Venus.

J. Geophys. Res. 113, E02012. https://doi.org/10.1029/2007JE002913.

Wilson, L., Head, J.W., 1983. A comparison of volcanic eruption processes on Earth, Moon, Mars, Io and Venus. Nature 302 (5910), 663–669. [https://doi.org/10.1038/](https://doi.org/10.1038/302663a0) [302663a0](https://doi.org/10.1038/302663a0).

Wang, S., Jiang, M., Zhao, T., Shi, A., 2024. Analyzing strain localization of Chang’E-5 lunar regolith through discrete element analysis. Powder Technol. 448, 120293. https://doi.org/10.1016/j.powtec.2024.120293.

[Weiblen, P.W., Murawa, M.J., Reid, K.J., 1990. Preparation of simulants for lunar surface](http://refhub.elsevier.com/S0012-821X%2825%2900038-X/sbref0069) [materials. Proceed. Am. Society of Civil Eng. Space II 98–106](http://refhub.elsevier.com/S0012-821X%2825%2900038-X/sbref0069).

Wilding, L.P., 1994. Factors of soil formation: contributions to pedology. Harden and M Singer (eds.). In: R Amundson, J (Ed.), Factors of Soil Formation: a Fiftieth Anniversary Retrospective. _Soil Sci. Soc. Am_. Special Publ, Madison, WI, pp. 15–30. https://doi.org/10.2136/sssaspecpub33. No.33.

Willman, B.M., Boles, W.W., McKay, D.S., Allen, C.C., 1995. Properties of lunar soil simulant JSC-1. J. Aerosp. Eng. 8 (2), 77–87. https://doi.org/10.1061/(ASCE)0893-

1321(1995)8:2(77).

Xu, G., Li, Y., Pang, R., Chen, Z., Ren, X., 2024. Constitutive model analysis of Chang’e-5 simulated lunar regolith solidified bodies under compression. Case Studies in Construct. Mater. 21, e03704. [https://doi.org/10.1016/j.cscm.2024.e03704](http://doi.org/10.1016/j.cscm.2024.e03704).

Zhang, H., Zhang, X., Zhang, G., Dong, K., Deng, X., Gao, X., Yang, M., 2022a. Size, morphology, and composition of lunar samples returned by Chang’E-5 mission. Sci. China Phys., Mechan. Astron., 65, 1–8. [https://doi.org/10.1007/s11433-021-1818-](https://doi.org/10.1007/s11433-021-1818-1) [1](https://doi.org/10.1007/s11433-021-1818-1).

Zhang, Jun, 2025. data source of Unity of terrestrial soil and extraterrestrial regolith in granular configuration (including samples from Chang’e-6). Mendeley Data. [https://](https://doi.org/10.17632/7n6pmzbyr6.2) [doi.org/10.17632/7n6pmzbyr6.2](https://doi.org/10.17632/7n6pmzbyr6.2). V2.

Zhang, J., Li, Y., Yang, T., Liu, J., Guo, X., Yao, Y., 2023. A universal grain-size distribution of soil with scaling invariance. Eur. J. Soil Sci. 74 (2), e13354. [https://](https://doi.org/10.1111/ejss.13354) [doi.org/10.1111/ejss.13354](https://doi.org/10.1111/ejss.13354).

Zhang, J., Li, Y., Liu, D., Jiang, N., Yang, T., Guo, X., Yao, Y., 2022b. The probability- based granular field of vegetated soils. Earth Surface Process. Landforms 47 (13), 3100–3116. https://doi.org/10.1002/esp.5446.

Zheng, Y., Wang, S., Ouyang, Z., Zou, Y., Liu, J., Li, C., Feng, J., 2009. CAS-1 lunar soil simulant. Adv. Space Res. 43 (3), 448–454. [https://doi.org/10.1016/j.](https://doi.org/10.1016/j.asr.2008.07.006) [asr.2008.07.006](https://doi.org/10.1016/j.asr.2008.07.006).

Zou, Y., Wu, H., Chai, S., Yang, W., Ruan, R., Zhao, Q., 2024. Development and characterization of the PolyU-1 lunar regolith simulant based on Chang’e-5 returned samples. Int. J. Min. Sc. Technol. https://doi.org/10.1016/j.ijmst.2024.08.006.
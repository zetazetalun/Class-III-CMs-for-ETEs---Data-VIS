## Fabrication of Flexible Thermoelectric Energy Harvesting System

Downloaded from ascelibrary.org by University of Liverpool on 07/22/25. Copyright ASCE. For personal use only; all rights reserved.

Guangxi Wu<sup>1</sup>; Ferin Neff<sup>2</sup>; and Xiong (Bill) Yu<sup>3</sup>

<sup>1</sup>Graduate Assistant, Dept. of Electrical Engineering and Computer Science, Case Western Reserve Univ. E-mail: [gxw94@case.edu](mailto:gxw94@case.edu)

<sup>2</sup>Undergraduate Assistant, Dept. of Civil Engineering, Case Western Reserve Univ. E-mail: [fyn2@case.edu](mailto:fyn2@case.edu)

<sup>3</sup>Professor, Dept. of Civil Engineering, Dept. of Electrical Engineering and Computer Science (Courtesy Appointment), Dept. of Mechanical and Aerospace Engineering (Courtesy Appointment), Case Western Reserve Univ. E-mail: [xxy21@case.edu](mailto:xxy21@case.edu)

# ABSTRACT

Thermoelectric energy harvesting is promising to provide sustainable energy source in the extraterrestrial environment. This paper describes procedures incurred in the fabrication of thermoelectric energy harvester on flexible substrates. An electrically parallel structure is proposed, which features higher energy efficiency than the counterpart electrically series structure based on theoretical analyses. As proof of concept, flexible thermoelectric harvesters in electrically parallel and series structures are prepared with thick film printing procedures. The performance of elements and device with different architectures are characterized. Both analytical and experimental comparison imply a promising improvement of energy conversion efficiency by using the electrically parallel structure.

# INTRODUCTION

Thermoelectric modules (TEMs) when used as generators (TEGs) are capable of providing continuous energy for extraterrestrial explorations, where sun light is not always available or intense enough for solar cells to work. For example, the solar brightness on Mars and Jupiter is as weak as 45% and 4%, respectively. It is even negligible on other planets (Elsheikh, Shnawah et al. 2014). TEGs driven by the decay of suitable radioactive materials, such as radioisotope thermoelectric generators (RTGs), have received the most interest, because of a proven reliability and durability over the last 5 decades (El-Genk, Saber et al. 2003). In addtion, RTGs are compact, rugged, radiation-resistant, and scalable. They are solid-state devices, thus generate no noise, vibration or torque during operation. These properties have made RTGs suitable for autonomous missions in the extreme environment of space and on planetary surfaces (Yang and Caillat 2011).

TEGs have been suffered from low energy conversion efficiency, which inevitably induces a large volume and heavy mass, because of such a monotonous heat source of radioisotope materials. Researchers have made excessive efforts on increasing thermoelectric materials’ intrinsic figure-of-merit then improving the TEG conversion efficiency. However, the naturally existing ubiquitous temperature gradient on the spacecraft or extraterrestrial vehicle body caused by common drastic temperature change in extraterrestrial environment has not been effectively leveraged. For example, a summer day on Mars may get up to 20°C near the equator, but at night the temperature can plummet to about -73°C. On the moon, the temperature can reach 123°C when sunlight hits the moon's surface. Otherwise the temperatures drops to -153°C. If the spacecraft or extraterrestrial vehicle body surface can be covered by TEGs, energy provided by the TEGs will be significantly boosted up.

In order to realize the aforementioned idea, the TEGs are better to be flexible enough to adjust its shape. Researchers have explored printing techniques to fabricate flexible TEMs (A Chen 2011; Madan, Chen et al. 2011; Hewitt, Kaiser et al. 2012; Madan, Chen et al. 2012; Madan, Wang et al. 2012; Wang, Chen et al. 2012), but they are not appropriate for large area device fabrication, because of the conventional electrically series TEM structure. This paper proposes an electrically parallel TEM structure, which is promising to not only improve the energy conversion efficiency, but also simplify the fabrication process of large area flexible TEGs. This paper compares the conversion efficiency between the conventional electrically series structure and the proposed electrically parallel structure, first analytically then experimentally based on a thick film printing technology. Observations are concluded in the end.

𝑇2

n

𝑇1

𝐼

p

𝑅𝐿

**Figure 1. Conventional electrically series TEM structure. The arrows represent current directions when the bottom temperature is higher than the top temperature (_T1>T2_).**

# ELECTRICALLY SERIES TEM EFFICIENCY

Conventionally, a thermoelectric module (TEM) is composed of alternant p-legs and n-legs that are connected in series both electrically and thermally, shown in Figure 1. The TEM’s efficiency is defined as the ratio of the electrical energy delivered to the external load circuit, to the absorbed energy from the heat source. Corresponding to this electrically series structure, the maximum possible energy efficiency is depicted as equation (1), under simplified assumptions that the TEM is working under a small temperature gradient (Ioffe 1957) and all material properties are temperature independent.

1 _ZT_module 1

max

 _TH_  _TC_ 

_TH_

 _TC TH_

(1)

where _TH_ is the hot side absolute temperature, _TC_ is the cold side temperature, _T_ is the algebraic

1 _ZT_module

mean value of _T<sub>H</sub>_ and _T<sub>C</sub>_ , and _ZT_module is the TEM’s dimensionless figure-of-merit, which equals to

  2

  2

2   1 _n_ 

 1 _<sup>p</sup>_ 

_<sub>p</sub>_ _<sub>n</sub>_  _T_



 2_T_  _p_ 

 <sup>2</sup>_T_ 

_ZT_   _p_     _n_   _n_ 

(2)

_module_

 _<sub>p</sub>_ _<sub>p</sub>_

_<sub>n</sub>__<sub>n</sub>_

_<sub>n</sub>__<sub>n</sub>_

 _<sub>p</sub>_ _<sub>p</sub>_

 _<sub>p</sub>_ _<sub>p</sub>_

_<sub>n</sub>__<sub>n</sub>_

2





  _<sub>p</sub>_ _<sub>p</sub>_

 2

_<sub>n</sub>__<sub>n</sub>_

 2

1  1 

Downloaded from ascelibrary.org by University of Liverpool on 07/22/25. Copyright ASCE. For personal use only; all rights reserved.

   

where  is the Seebeck coefficient,  is the electrical resistivity, and  is the thermal

conductivity. The subscripts _p_ and _n_ indicate that the corresponding coefficients belong to the _p_\-type and _n_\-type material, respectively. Equation (1) implies that the higher the module’s figure-of-merit _ZT_<sub>module</sub> , the higher the module’s efficiency. From equation (2), researchers abstract the

figure-of-merit of a certain material as shown in equation in equation (3), in order to evaluate a material’s possible maximum intrinsic efficiency when forming a TEM.

 2

_ZTmaterial_   _T_ (3)

Please note that equation (3) is valid only for a certain type of material, rather than the

module. It cannot be directly plugged into equation (1). Equation (2) indicates that the higher the

material figure-of-merit _ZTmaterial_ of a certain type of material that forms the TEM, the higher the

module’s figure-of-merit _ZT_<sub>module</sub> , the higher the module’s efficiency. This is the reason why researchers are continuously trying to find better TE materials that have higher _ZTmaterial_ .

In reality, it is almost impossible to find two perfectly matched _p_\-type and _n_\-type TE

materials that have the exact same values of electrical resistivity ( _p_  _n_ ), thermal conductivity ( _p_  _n_ ), and the same absolute values of Seebeck coefficient (_p_  _n_ ) under the same temperature. For the simplest case of single crystal materials, the effective masses of electrons and holes are different with respect to _p_\-type and _n_\-type counterparts, resulting in a different electrical resistivity. For nanostructured materials, the extensive grain boundaries might scatter

electrons and holes at different levels, leading to unmatched electrical resistivity (Poudel, Hao et

al. 2008). For oxide TE materials, most _n_\-type materials are inferior due to their high thermal conductivities (He, Zhang et al. 2015) compared to their _p_\-type counterparts. For organic TE materials, it is difficult to dope organic semiconductors to make them _n_\-type (Panthani and Korgel 2012) and air stable (Chen and Ren 2013). For half-Heusler TE materials, most efforts thus far have be contributed to the _n_\-type half-Heusler alloys. The search for promising _p_\-type half-Heusler materials that can be coupled to existing high-performance _n_\-type half-Heusler alloys for high-temperature thermoelectric power generation has just been initiated in the past decade (Hamid Elsheikh, Shnawah et al. 2014). All those aforementioned reasons will lead to the mismatch of material properties between the _p_\-type materials and their _n_\-type counterparts.

The module’s figure-of-merit _ZTmodule_ has been impaired by the inevitable material property

mismatch. Assume that the material figure-of-merits of the _p_\-type and _n_\-type materials that form

the TEM under temperature of _T_ are _ZTmaterial_ , _p_ and _ZTmaterial_ ,_n_ , and the TEM is working under a

small temperature gradient ( _T_  (_TH_  _TC_ ) / 2  _T_ ). If _ZTmaterial_ , _p_  _ZTmaterial_ ,_n_ , we can define the

attenuation factor _A_ ( _A_  1) of the module’s figure-of-merit _ZT_module compared to _ZTmaterial_ , _p_ as

equation (4), referring to equation (2). Similarly, if _ZTmaterial_ ,_n_  _ZTmaterial_ , _p_ , the attenuation factor

_A_ can be defined as equation (5).

_A_  1 /  2 / 1

_n__n_ / _p__p_

_n p_

_material_ , _p material_,_n_

2 , when _ZT_

- _ZT_

(4)

_A_  1

_p n_

/  2 / 1

2 , when _ZT_

- _ZT_

(5)

Take the most popular TE material bismuth telluride (Bi2Te3) under room temperature as an example. If an electrically series TEM is composed of _p_\-type and _n_\-type materials that have properties described as Table 1 at 300 K (Goldsmid, Sheard et al. 1958), the attenuation factor is

_p__p_ / _n__n_

Downloaded from ascelibrary.org by University of Liverpool on 07/22/25. Copyright ASCE. For personal use only; all rights reserved.

_material_,_n material_, _p_

_A_  0.76 shown in equation (6), compared to the _n_\-type Bi2Te3, which has the relative higher

material figure-of-merit _ZTmaterial_ .

1



 

_<sub>n</sub>_ 

_p_ 

2

   2     2

_ZT_module

 _<sub>p</sub>_ _<sub>p</sub>_

_<sub>n</sub>__<sub>n</sub>_



_n_

   2

0.76

_<sup>n</sup>_ \=0.56



(6)

_n n n n_

Downloaded from ascelibrary.org by University of Liverpool on 07/22/25. Copyright ASCE. For personal use only; all rights reserved.

1 

 

 

## Table 1. Material properties of a pair of thermoelectric materials (Bi2Te3).

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| _Material_ | _Electrical Resistivity_ <br><br>_(mΩ∙cm)_ | _Seebeck Coefficient_<br><br> _(μV/K)_ | _Thermal_<br><br>_Conductivity_<br><br> _W/(cm∙K)_ | _Material figure-of-merit ZTmaterial at 300K_ |
| Bi2Te3 (_p_) | 0.83 | 156.57 | 2.09×10<sup>\-2</sup> | 0.42 |
| Bi2Te3 (_n_) | 0.73 | \-193.00 | 2.04×10<sup>\-2</sup> | 0.74 |

The calculation implies that the overall TEM’s figure-of-merit _ZT_module is highly dependent

on whether or not its _p_\-type and _n_\-type material properties are matched well with each other. If there are no existing matched materials with respect to a certain working temperature, the

potential of the material that has the relative higher material figure-of-merit _ZTmaterial_ will be

wasted (by 24% in this example). If the electrically parallel module structure is used, the

module’s figure-of-merit _ZT_module can be increased significantly, which will further impact the

TEM’s overall efficiency. The reason is explained in the following section.

# ELECTRICALLY PARALLEL TEM EFFICIENCY

This paper proposes an alternative TEM structure where the legs are connected in parallel both thermally and electrically, as shown in Figure 2. The legs have to be made from the same type of TE materials (_p_\-type or _n_\-type), in order to keep the same polarity for both legs. The electrically parallel TEM’s figure-of-merit is derived as follows.

## Figure 2. Electrically parallel TEM where (a) both legs are _p_\-type semiconductor materials

**(b) both legs are _n_\-type semiconductor materials. The arrows represent the current directions when _T1>T2 ._**

Assuming that the TEM is under a small temperature gradient and all material properties (Seebeck coefficient, electrical resistivity and thermal conductivities) remain constant along the temperature gradient of both legs, (in other words, the Thomson effect is neglected at this time

being), when the unit TEM is built-up by legs A and B, the equivalent value of the overall inner resistance _RS_ , Seebeck coefficient  and thermal conductivity _K_ of this unit module are as

follows:

_R_  _R_ || _R_ 

_RARB_  _L_

(7)

_S A B_

_R_  _R S S_

   _A_  _B_   _R_

 

_A B_

|| _R_  _A_

_A_  _B_

_A B_

 _<sub>B</sub>_

(8)

 _R R_  _A B_  _S_  _S_

 _A B_ 





_A B_ 1

_BSA_

_B A_ 1

_ASB_

_K_  1  _S_   _S_ 

(9)

_L A A B B_

where _L_ is the length of both legs, which is assumed to be the same for both legs for the sake of fabrication convenience, _R_ is the inner resistance and _S_ is the cross-sectional area. Then the equivalent total current flowing through the circuit ( _T_<sub>1</sub>  _T_<sub>2</sub> ) is

_I_   _T_1  _T_2    _T_1  _T_2 

(10)

_RS_  _RL RS_ 1 _m_

where _m_ is defined as the ratio between _RL_ and _RS_ ( _RL_ / _RS_  _m_ ). Therefore the amount of heat

energy _QPeltier_ absorbed at the hot junctions of the two legs through Peltier effect is

 <sup>2</sup>_T_ _T_  _T_ 

_QPeltier_

 _IT_1 

1 1 2

_R_ 1 _m_

(11)

_S_

The heat energy transferred from the hot junctions to the cold junctions through heat conduction _Qh_ is

_Q<sub>h</sub>_  _K_ _T_<sub>1</sub> _T_<sub>2</sub> 

The Joule heat generated in the two legs is

(12)

_Q_  _I_ <sup>2</sup>_R_

1 2



 <sup>2</sup> _T_  _T_ 2

(13)

_J S_ 1 _m_2

_R_

_S_

The useful power _W_ delivered by the generator unit module to the load resistor is

 <sup>2</sup> _T_  _T_ 2 _m_

_W_  _I_ <sup>2</sup>_R_ 

_L_

1 2

_R_ 1 _m_2

_S_

(14)

Half of the Joule heat generated by the generator legs returns to the hot junctions while the other half flows to the cold junctions (Rowe 1995). The module’s efficiency equals to the ratio

between the useful electrical energy _W_ delivered to the load resistor _RL_ , and the energy

absorbed from the heat source, which equals to the summation of the Peltier heat conduction heat _Qh_ , deducted by the Joule heat returned to the heat source.

_m_

_QPeltier_ and the

  _W_

_Q_  _Q_

 1 _Q_

 _T_1  _T_2 

_T_1 1

_m_ 1

_m_ 1

 1 _T_1  _T_2 1

(15)

_Peltier h_ 2 _J_

_Z T_ 2 _T m_ 1

module 1 1

Downloaded from ascelibrary.org by University of Liverpool on 07/22/25. Copyright ASCE. For personal use only; all rights reserved.

where _ZT_module is the module’s figure-of-merit, which equals to

 <sub>2</sub>   <sup>2</sup> 

_B x_  2 _B x_  _B A_

 <sup>2</sup>_T_  <sup>2</sup>_T_    <sup>2</sup> 

_ZT_module   _A_  _A A A B_

(16)

_KR<sub>S</sub>_ _<sub>A</sub>__<sub>A</sub>_ _<sub>B</sub> x_2  1 _<sub>B</sub>__<sub>B</sub>_  _x_  _<sub>B</sub>_

     

_A_  _A A_  _A_

where _x_  _SA_ / _SB_ and the material figure-of-merit of the two legs is assumed to be

_ZTmaterial_ , _A_  _ZTmaterial_ ,_B_ .

When the materials that form leg A and B are different (but belong to the same type, _n_\-type or _p_\-type), it can be proved that the maximum value of the module’s figure-of-merit can be

achieved at _x_  _SA_ / _SB_  . This equation is possible when the cross-section area of the B leg

becomes zero. Therefore, leg B is eliminated. Hence, the module’s figure-of-merit reach its maximum value at

_ZT_module

can

 2

_ZT_module  _A T_

_<sub>A</sub>__<sub>A</sub>_

which is equal to the material figure-of-merit of leg A.

(17)

When the materials that form leg A and B are the same, it can be proved that the module’s

Downloaded from ascelibrary.org by University of Liverpool on 07/22/25. Copyright ASCE. For personal use only; all rights reserved.

figure-of-merit _ZT_module always remains at the maximum possible value as equation (17), no

matter how the ratio of _x_  _SA_ / _SB_ changes.

When the ratio between _RL_ and _RS_ ( _RL_ / _RS_  _m_ ) is adjusted to realize  / _m_  0 , the

module’s efficiency shown in equation (15) can reach its highest value, whose expression is the same as equation (1).

When the electrically parallel structure is utilized, the TEM’s figure-of-merit, when used as TEG, can be the same as the material that has the higher material figure-of-merit. Therefore, the potential of TE materials will not be wasted by the mismatch between the two materials that form the two legs of the unit module, as it would be when using the conventional electrically series structure. The overall module efficiency will be increased for the proposed electrically parallel structure, for example by 32% if the material properties listed in Table 1 is involved. In order to further compare the proposed electrically parallel structure with the conventional electrically series structure, the authors have explored the stencil printing fabrication process of TEM on flexible substrates, using self-made TE inks and commercial gold ink. This fabrication process is explicated in the next section.

# TEM FABRICATION PROCESS USING FILM PRINTING TECHNOLOGY

**Material preparation:** The TE material used in the fabrication process is Bi2Te3, for both _n_\-type and _p_\-type. The raw materials were bought from Merit Technology Group (MTG) Co., Ltd in coarse powder format. In order to increase the _ZT_ of the materials, the nanocomposite (Wang, Lee et al. 2008, Yu, Zebarjadi et al. 2012) bulk processing process was emulated, where the _ZT_ is increased because of the limitation of phonon transport inside the material by grain boundary scattering. Raw materials were first ball milled using a tube driver (IKA ULTRA TURRAX Tube Drive) with mass ratio of 10:1 between stainless steel balls and the TE powder. Isopropanol (IPA) that can right immerse the powder and stainless steel balls was used as the grinding agent. The rotation speed was set at mode 3 (~2200 rpm) for 1 minute, next at mode 5 (~3500 rpm) for

1 minute, then at mode 7 (~4700 rpm) for 1 minute and finally at mode 9 (~6000 rpm) for 5 minutes.

Downloaded from ascelibrary.org by University of Liverpool on 07/22/25. Copyright ASCE. For personal use only; all rights reserved.

## Figure 3. Electrode mesh screen designs for (a) electrically series and (b) parallel TEM structure.

## Figure 4. Stencil designs for (a) left TE legs and (b) right TE legs.

The resulting mixture in the tube was transferred into a container, while the stainless steel balls were filtered out for the next run. After several runs, the ground powder immersed in the grinding agent IPA in the container was dried in an air hood to evaporate the IPA thoroughly. The dry powder then was filtered using a sieve holding a piece of 200 mesh copper (TWP Inc.). The maximum grain size of the filtered TE powder is limited to 76 microns, because the copper wire diameter is 0.0508 mm (0.002 inch) and there are 200 meshes per 2.54 cm (1 inch).

**TE ink preparation:** The aforementioned ground _p_\-type and _n_\-type TE powder were used as filler particles into an epoxy matrix system to form TE inks. A vertex mixer (Fisher Scientific Vortex Mixer) was used to make sure the TE particles were homogenized evenly. The TE powder-to-epoxy system ratio was 4.5:1, which meets the viscosity requirement of the later printing process. The epoxy matrix system includes epoxy resin (EPON Resin 863), hardener

(MHHPA) and reaction catalyst (AC-8) with mass ratio of 100:85:1 (A Chen 2011, Madan, Chen et al. 2011).

**Screen and stencil design:** Mesh screens and stainless steel stencils were designed for printing electrode and TE legs, respectively. Metal electrodes were printed using commercial gold ink (Ercon E4464). Mesh screens were designed for both electrically series and electrically parallel device structure, as shown in Figure 3. TE legs were printed using the TE inks described above. Stencils were designed for left legs and right legs, as shown in Figure 4. Therefore, there are totally two screens and two stencils. TE devices with several aspect ratios were integrated into one print. Alignment marks were added to make sure that different layers of printed films can be aligned well.

Screen #1

Screen #2

Stencil #1

Stencil #2

Downloaded from ascelibrary.org by University of Liverpool on 07/22/25. Copyright ASCE. For personal use only; all rights reserved.

Traditional electrically serial TE module

Electrically parallel TE module (p-type)

Electrically parallel TE module (n-type)

**Figure 5. Printing process for both electrically series and parallel structure TEMs. Printing process:** The overview of the printing sequences is shown as shown in Figure 5.

The flexible substrate that the TEMs were printed on is polyimide, which is thermally stable

enough to withstand the curing temperatures of both gold electrodes and TE legs. The substrates were equally separated into three groups, for electrically series TEMs (group 1), _p_\-type electrically parallel TEMs (group 2) and _n_\-type electrically parallel TEMs (group 3), respectively. First, the commercial gold ink was printed on group 1 substrates using electrically series structure mesh screen. Then the gold ink was printed on group 2 and 3 using electrically parallel structure mesh screen. After this step, all electrodes were printed. The gold electrodes were cured under a temperature of 110 °C for 10 minutes to be ready for TE inks printing. The left legs of the TEMs were first printed on all groups of substrates using the left-leg stencil. For group 1 and 2, the _p_\-type TE ink was used. For group 3, the _n_\-type TE ink was used. Then the right legs were printed on all groups of substrates using the right-leg stencil. For group 1 and group 3, the _n_\-type TE ink was used. For group 2, the _p_\-type TE ink was used. After this step, all the TE legs were printed. The TE inks were cured under temperature of 110 °C for 24 hours.

Electric wires were attached to the electrode wire bond pads by using silver epoxy (H31 EPOXY

Technology), which was hardened under temperature of 150°C for 2 hours. All the printing procedures were carried out on an MPM TF-100 Thick Film Printer in a class 10,000 clean room. After the printing process is done, the device is rolled up to form the final TEM. An example final device is shown in Fig. 6.

Downloaded from ascelibrary.org by University of Liverpool on 07/22/25. Copyright ASCE. For personal use only; all rights reserved.

**Figure 6. (a) Printed electrically series TEM on flexible polyimide substrate. (b) The rolled-up printed TEM on flexible polyimide substrate.**

# TEM ELECTRIC OUTPUT PERFORMANCE CHARACTERIZATION

**Heat source and sink:** When the fabricated unit TEMs are used as thermoelectric generators (TEGs), the electric output performance of both electrically series and parallel structures were characterized using an experiment setup shown in Figure 7(a), where the TEM in question was located between a heat source and a heat sink. The heat source is a printed platinum resistor on ceramic (Al2O3) substrate, provided by Electronics Design Center (EDC) at Case Western Reserve Univ., shown in Figure 7(b). The top temperature of the TEM was adjusted by controlling the current flowing through the printed resistor, whose inner resistance is around 100 Ω. The heat sink is made of aluminum, immersed in iced water. The bottom temperature of the TEM was approximately 0 °C. In order to guarantee good thermal contacts for the TEM in question with the heat source and heat sink, silicone heat transfer compound (MG Chemicals, 860-150G) was used in between.

Heat Source

TEM

Heat Sink

Iced Water

(a) (b)

## Figure 7. (a) Experiment setup to characterize TEM electric output performance. (b) The heat source.

**Output voltage and current measurement:** A trans-impedance amplifier was designed to simultaneously collect the output voltage and current of the TEM with high accuracy, as shown in Figure 8, where an operational amplifier (OPA350PA) is utilized and powered by ±1.5 V

power source provided by AAA batteries. The non-inverting input pin is grounded. The inverting input pin is connected to the positive output electrode of the unit TEM. A resistor R bridges between the inverting input and the output of the op-amp. A diode (LM4041DIZ-1.2/NOPB) is reversely biased, resulting a fixed potential difference of about 1.2 V between the ground and one end of R1, whose another end connects to the -1.5 V power source. Two electrically series resistors, R2 and R3 (a potentiometer), used as a voltage divider of the 1.2 V potential difference, are in parallel with the reversely biased diode. The middle pin of the potentiometer R3 connects to the negative output electrode of the unit TEM.

Downloaded from ascelibrary.org by University of Liverpool on 07/22/25. Copyright ASCE. For personal use only; all rights reserved.

When the knob of the potentiometer R3 rotates, the output voltage of the unit TEM changes. Meanwhile, the load resistance of the TEM changes accordingly. The advantage of this circuit design is that the output I-V curve of the TEM can be captured along with step changes of its output voltage. Voltages at the negative output electrode of the unit TEM (V1) and the output pin of the op-amp (V2) are collected, which correspond to the output voltage (-V1) and the output current (-V2/R), respectively. The higher the value of the trans-resistor R, the higher the accuracy of the output current of the unit TEM. For example, if R=1GΩ, nano-ampere scale of output current can be captured. Capacitors are placed between the power source and the ground, as well as between two ends of the trans-resistor R, in order to integrate thermal noise. The whole circuit was embedded inside a metal box to get rid of impact from the electromagnetic noise.

The voltages V1 and V2 were recorded using data acquisition device CR1000 (CAMPBELL Scientific Inc.). Temperatures at the top and bottom boundaries of the unit TEM were measured using _k_\-type thermocouples. The two thermocouples’ output voltages were also recorded by the CR1000. Data sampling frequency was 1 Hz. There were at least 30 data samples with respect to each step of the output voltage. The averaged value of the output current and voltage in each step were concluded.

**Figure 8. Trans-impedance amplifier design to monitor the output current and voltage of the printed TEM.**

# ELECTRIC OUTPUT PERFORMANCE COMPARISON

Downloaded from ascelibrary.org by University of Liverpool on 07/22/25. Copyright ASCE. For personal use only; all rights reserved.

When the trans-resistor R=10 KΩ and the temperature difference between the top and bottom temperature of the TEM is 50°C, the output current versus voltage (I-V) curves of _p_\-type electrically parallel structure, _n_\-type electrically parallel structure and electrically series structure TEMs that have the same TE leg dimensions are shown in Figure 9(a). Corresponding output power versus voltage curve (W-V) curves are calculated and shown in Figure 9(b). All the output I-V data points are fitted using linear fitting algorithm (OriginLab built-in), shown as the solid lines in Figure 9(a). Meanwhile, the output power data points were fitted using second-order polynomial fitting algorithm (OriginLab built-in) shown as the solid lines in Figure 9(b).

## Figure 9. Comparisons of TEM electric output performance among different structures. (a) Output I-V curves. (b) Output W-V curves.

Figure 9(a) indicates that the open-circuit voltage of the _n_\-type electrically parallel structure TEM is the higher than the _p_\-type electrically parallel structure TEM. It implies that the _n_\-type material used in our experiment has a higher Seebeck effect coefficient than the _p_\-type

counterpart does. Considering 9(b) together, one can see that the maximum output power of the _n_\-type electrically parallel structure TEM is the higher than the _p_\-type electrically parallel structure TEM. It reveals that the material figure-of-merit of the _n_\-type material used in our experiment is higher than the _p_\-type counterpart does.

Downloaded from ascelibrary.org by University of Liverpool on 07/22/25. Copyright ASCE. For personal use only; all rights reserved.

Figure 9(a) also shows that the open-circuit voltage of the electrically series structure TEM is smaller than the _n_\-type electrically parallel structure TEM. However, the open-circuit voltage of the electrically series structure TEM is expected to be higher than the electrically parallel structure TEM counterparts in theory. This might be caused by the electrically series structure TEM’s large inner resistance. When the inner resistance of a TEM is too large, especially comparable to the inner resistance of voltmeters (V1 and V2 in Figure 8), part of its thermoelectric potential falls on its inner resistance. Hence, the voltmeter gives an underestimated open circuit voltage. Similarly, a large inner resistance of the TEM can cause an over estimated short circuit current if the measurement circuit setup is the one shown in Figure 8. This is because the inner resistance of the voltmeter (V2) is in parallel with the inner resistance of the TEM, which equivalently decreases the TEM inner resistance and increases the short circuit current. In short, each data points on the I-V curve of the electrically series structure TEM might have an under estimated voltage and an over estimated current. Taking Figure 9(b) into consideration, the output power estimation of the electrically series structure TEM might still be meaningful, because the output power is a product between an under estimated voltage and an over estimated current. Figure 9(b) shows that the maximum output power of the electrically series structure TEM is lower than the _n_\-type electrically parallel structure TEM. In other words, this observation complies with the aforementioned analytical analysis that using electrically parallel structure is promising to improve the module’s figure-of-merit.

# CONCLUSION

This paper proposes an electrically parallel TEM structure, which is promising to improve the output power of TEMs when used as TEGs, through analytical analysis. Flexible TEMs with both electrically series and parallel device structures were fabricated based on thick film printing technology. The electric output performance (I-V and W-V curves) were characterized.

Preliminary results comply with the analytical analysis.

It has to be pointed out that the TEMs with electrically parallel structure fabricated in this study are only for comparison purpose with the conventional electrically series structure. They are first printed on planar substrate and then rolled up to form the TEMs. The applied temperature gradient is actually in the plane of the substrate. This device structure is not suitable for large area production. A more straightforward device structure for electrically parallel TEMs is a sandwiched multilayered structure, where the TE material layer is in the middle of two electrode layers. The sandwiched structure can dramatically simplify the fabrication process of electrically parallel structure TEMs. In short, the electrically parallel TEMs is a prospective solution to not only improve the energy conversion efficiency, but also simplify the fabrication process in terms of large area implementation.

# REFERENCES

A Chen, D. M., P K Wright and J W Evans (2011). “Dispenser-printed planar thick-film thermoelectric energy generators.” Journal of Micromechanics and Microengineering **21**(10).

Chen, S. and Z. Ren (2013). “Recent progress of half-Heusler for moderate temperature thermoelectric applications.” Materials Today **16**(10): 387-395.

El-Genk, M. S., H. H. Saber and T. Caillat (2003). “Efficient segmented thermoelectric unicouples for space power applications.” Energy Conversion and Management **44**(11): 1755-1772.

Downloaded from ascelibrary.org by University of Liverpool on 07/22/25. Copyright ASCE. For personal use only; all rights reserved.

Elsheikh, M. H., D. A. Shnawah, M. F. M. Sabri, S. B. M. Said, M. H. Hassan, M. B. A. Bashir and M. Mohamad (2014). “A review on thermoelectric renewable energy: Principle parameters that affect their performance.” Renewable and Sustainable Energy Reviews **30**: 337-355.

Goldsmid, H. J., A. R. Sheard and D. A. Wright (1958). “The performance of bismuth telluride thermojunctions.” British Journal of Applied Physics **9**(9): 365.

Hamid Elsheikh, M., D. A. Shnawah, M. F. M. Sabri, S. B. M. Said, M. Haji Hassan, M. B. Ali Bashir and M. Mohamad (2014). “A review on thermoelectric renewable energy: Principle parameters that affect their performance.” Renewable and Sustainable Energy Reviews **30**: 337-355.

He, W., G. Zhang, X. Zhang, J. Ji, G. Li and X. Zhao (2015). “Recent development and application of thermoelectric generator and cooler.” Applied Energy **143**: 1-25.

Hewitt, C. A., A. B. Kaiser, S. Roth, M. Craps, R. Czerw and D. L. Carroll (2012). “Multilayered Carbon Nanotube/Polymer Composite Based Thermoelectric Fabrics.” Nano Letters **12**(3): 1307-1310.

Ioffe, A. F. (1957). “Semiconductor thermoelements and thermoelectric cooling.”

Madan, D., A. Chen, P. Wright and J. Evans (2012). “Printed Se-Doped MA n-Type Bi2Te3 Thick-Film Thermoelectric Generators.” Journal of Electronic Materials **41**(6): 1481-1486.

Madan, D., A. Chen, P. K. Wright and J. W. Evans (2011). “Dispenser printed composite thermoelectric thick films for thermoelectric generator applications.” Journal of Applied Physics **109**(3): 034904-034904-034906.

Madan, D., Z. Wang, A. Chen, R.-c. Juang, J. Keist, P. K. Wright and J. W. Evans (2012). “Enhanced Performance of Dispenser Printed MA n-type Bi2Te3 Composite Thermoelectric Generators.” Acs Applied Materials & Interfaces **4**(11): 6117-6124.

Panthani, M. G. and B. A. Korgel (2012). “Nanocrystals for electronics.” Annual review of chemical and biomolecular engineering **3**: 287-311.

Poudel, B., Q. Hao, Y. Ma, Y. Lan, A. Minnich, B. Yu, X. Yan, D. Wang, A. Muto, D. Vashaee,

X. Chen, J. Liu, M. S. Dresselhaus, G. Chen and Z. Ren (2008). “High-Thermoelectric Performance of Nanostructured Bismuth Antimony Telluride Bulk Alloys.” Science **320**(5876): 634-638.

Rowe, D. M. (1995). CRC handbook of thermoelectrics, CRC press.

Wang, X. W., H. Lee, Y. C. Lan, G. H. Zhu, G. Joshi, D. Z. Wang, J. Yang, A. J. Muto, M. Y. Tang, J. Klatsky, S. Song, M. S. Dresselhaus, G. Chen and Z. F. Ren (2008). “Enhanced thermoelectric figure of merit in nanostructured n-type silicon germanium bulk alloy.” Applied Physics Letters **93**(19): 193121.

Wang, Z., A. Chen, R. Winslow, D. Madan, R. C. Juang, M. Nill, J. W. Evans and P. K. Wright (2012). “Integration of dispenser-printed ultra-low-voltage thermoelectric and energy storage devices.” Journal of Micromechanics and Microengineering **22**(9): 094001.

Yang, J. and T. Caillat (2011). “Thermoelectric Materials for Space and Automotive Power Generation.” MRS Bulletin **31**(3): 224-229.

Yu, B., M. Zebarjadi, H. Wang, K. Lukas, H. Wang, D. Wang, C. Opeil, M. Dresselhaus, G. Chen and Z. Ren (2012). “Enhancement of Thermoelectric Properties by Modulation-Doping in Silicon Germanium Alloy Nanocomposites.” Nano Letters **12**(4): 2077-2082.
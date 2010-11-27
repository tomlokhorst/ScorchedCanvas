using System;
using System.Collections.Generic;
using System.Linq;

static class Landscape
{
  public static void Main()
  {
    var l = generateLandscape(50);
    l = l.increaseResolution(10);
    l = l.Take(1024);

    foreach (var x in l)
      Console.WriteLine(x);
  }

  private static IEnumerable<int> generateLandscape(int height)
  {
    var r = new Random();

    int y = height / 2;

    for (int x = 0; ; x++)
    {
      yield return y;

      // difference from previous y
      y += (int)(r.Next(-5, 6) ^ 4 / 400);

      // floor and ceiling
      y = Math.Max(0, Math.Min(height, y));
    }
  }

  private static IEnumerable<int> increaseResolution(this IEnumerable<int> xs, int nr)
  {
    bool first = true;
    int prev = 0;

    foreach (int x in xs.Select(y => y * 100))
    {
      if (!first)
      {
        int diff = (x - prev) / nr;

        for (int i = 0; i < nr; i++)
          yield return (prev + (diff * i)) / 100;
      }

      prev = x;
      first = false;
    }
  }


  /*
      public static double[] fakeLandscape = {100 ,101 ,102 ,103 ,104 ,105 ,106 ,107 ,108 ,109 ,110 ,111 ,112 ,113 ,114 ,115 ,116 ,117 ,118 ,119 ,120 ,121 ,122 ,123 ,124 ,125 
                                  ,126 ,127 ,128 ,129 ,130 ,131 ,132 ,133 ,134 ,135 ,136 ,137 ,138 ,139 ,140 ,141 ,142 ,143 ,144 ,145 ,146 ,147 ,148 ,149 ,150 ,150 
                                  ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 
                                  ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 
                                  ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 
                                  ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 
                                  , 100 , 100 , 100 , 100 , 100 , 100 , 100 , 100 , 100 , 100 , 100 , 100 , 100 , 100 , 100 , 100 , 100 , 100 , 100 , 100 , 100  
                                  , 100 , 100 , 100 , 100 , 100 , 100 , 100 , 100 , 100 , 100 , 100 , 100 , 100 , 100 , 100 , 100 , 100 , 100 , 100 , 100 , 100  
                                  , 100 , 100 , 100 , 100 , 100 , 100 , 100 , 100 , 100 , 100 , 100 , 100 , 100 , 100 , 100 , 100 , 100 , 100 , 100 , 100 , 100  
                                  ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 
                                  ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 
                                  ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 
                                  ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 
                                  ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,149 ,148 ,147 
                                  ,146 ,145 ,144 ,143 ,142 ,141 ,140 ,139 ,138 ,137 ,136 ,135 ,134 ,133 ,132 ,131 ,130 ,129 ,128 ,127 ,126 ,125 ,124 ,123 ,122 ,121 
                                  ,120 ,119 ,118 ,117 ,116 ,115 ,114 ,113 ,112 ,111 ,110 ,109 ,108 ,107 ,106 ,105 ,104 ,103 ,102 ,101 ,100 ,99, 98, 97, 96, 95, 94, 
                                  93, 92, 91, 90, 89, 88, 87, 86, 85, 84, 83, 82, 81, 80, 79, 78, 77, 76, 75, 74, 73, 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62,
                                  61, 60, 59, 58, 57, 56, 55, 54, 53, 52, 51, 50, 49, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 
                                  48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 
                                  48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 
                                  48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 
                                  48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 
                                  48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 
                                  48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 
                                  66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 
                                  98, 99, 100 ,101 ,102 ,103 ,104 ,105 ,106 ,107 ,108 ,109 ,110 ,111 ,112 ,113 ,114 ,115 ,116 ,117 ,118 ,119 ,120 ,121 ,122 ,123 
                                  ,124 ,125 ,126 ,127 ,128,129 ,130 ,131 ,132 ,133 ,134 ,135 ,136 ,137 ,138 ,139 ,140 ,141 ,142 ,143 ,144 ,145 ,146 ,147 ,148 ,149 
                                  ,150 ,151 ,152 ,153 ,154 ,155 ,156 ,157 ,158 ,159 ,160 ,161 ,162 ,163 ,164 ,165 ,166 ,167 ,168 ,169 ,170 ,171 ,172 ,173 ,174 ,175 
                                  ,176 ,177 ,178 ,179 ,180 ,181 ,182 ,183 ,184 ,185 ,186 ,187 ,188 ,189 ,190 ,191 ,192 ,193 ,194 ,195 ,196 ,197 ,198 ,199 ,200 ,201 
                                  ,202 ,203 ,204 ,205 ,206 ,207 ,208 ,209 ,210 ,211 ,212 ,213 ,214 ,215 ,216 ,217 ,218 ,219 ,220 ,221 ,222 ,223 ,224 ,225 ,226 ,227 
                                  ,228 ,229 ,230 ,231 ,232 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 
                                  ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 
                                  ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 
                                  ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 
                                  ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 
                                  ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 
                                  ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 
                                  ,233 ,233 ,233 ,233 ,233 ,233 ,233};
  */
  public static double[] fakeLandscape = {
	241.20652620538482, 242.81674008999278, 244.41155622598956, 245.99054245927226, 247.55327077416007, 
  249.0993174442394, 250.62826318171452, 252.13969328520616, 253.6331977859411, 255.10837159227606, 
  256.5648146325001, 258.0021319958603, 259.4199340717562, 260.8178366870494, 262.1954612414348, 
  263.55243484082195, 264.88839042867346, 266.20296691525226, 267.4958093047246, 268.76656882007256, 
  270.01490302576576, 271.2404759481463, 272.4429581934793, 273.62202706362416, 274.7773666692823, 275.90866804077586, 277.01562923631695, 278.09795544772385, 279.1553591035447, 280.18755996954724, 281.19428524653836, 282.1752696654729, 283.1302555798174, 284.0589930551319, 284.9612399558357, 285.83676202912386, 286.6853329860019, 287.50673457940775, 288.30075667939036, 289.06719734531765, 289.8058628950839, 290.516567971292, 291.19913560438374, 291.85339727269553, 292.4791929594152, 293.0763712064183, 293.64478916496483, 294.1843126432352, 294.6948161506883, 295.17618293922527, 295.6283050411423, 296.0510833038594, 296.44442742141086, 296.8082559626867, 297.14249639641395, 297.44708511286865, 297.72196744231076, 297.9670976701354, 298.1824390487343, 298.36796380606467, 298.5236531509213, 298.64949727491125, 298.74549535113067, 298.8116555295446, 298.84799492907246, 298.8545396263823, 298.83132464139953, 298.77839391953574, 298.6958003106449, 298.5836055447166, 298.4418802043152, 298.27070369377765, 298.07016420518073, 297.84035868109333, 297.58139277412766, 297.29338080330643, 296.9764457072629, 296.6307189942935, 296.2563406892824, 295.85345927751956, 295.42223164543464, 294.9628230182704, 294.4754068947214, 293.960164978562, 293.4172871072932, 292.8469711778356, 292.24942306929745, 291.6248565628503, 290.97349325874177, 290.29556249048056, 289.5913012362264, 288.8609540274201, 288.10477285469113, 287.32301707107797, 286.51595329260147, 285.6838552962297, 284.8270039152744, 283.94568693226086, 283.0401989693133, 282.11084137609924, 281.15792211537706, 280.18175564619156, 279.18266280476416, 278.1609706831244, 277.1170125055304, 276.0511275027278, 274.9636607840955, 273.85496320772955, 272.72539124851585, 271.5753068642441, 270.40507735981464, 269.215075249593, 268.00567811796486, 266.77726847814785, 265.5302336293136, 264.26496551207845, 262.9818605624177, 261.68131956406216, 260.36374749943377, 259.0295533991797, 257.67915019036343, 256.31295454337277, 254.93138671760437, 253.53487040598534, 252.12383257839352, 250.69870332403667, 249.25991569285327, 247.80790553599633, 246.34311134546329, 244.86597409293404, 243.37693706788073, 241.87644571501238, 240.36494747111772, 238.84289160137044, 237.3107290351602, 235.7689122015143, 234.2178948641731, 232.65813195638515, 231.09007941548472, 229.51419401731783, 227.93093321058, 226.34075495113146, 224.7441175363532, 223.1414794396096, 221.53329914488063, 219.9200349816297, 218.3021449599696, 216.68008660619188, 215.05431679872322, 213.4252916045722, 211.79346611633045, 210.15929428979086, 208.52322878224678, 206.88572079153343, 205.2472198958759, 203.60817389460345, 201.96902864979376, 200.33022792890728, 198.6922132484728, 197.05542371888484, 195.42029589037247, 193.7872636001992, 192.15675782115295, 190.52920651138425, 188.90503446565089, 187.2846631680257, 185.66851064612484, 184.05699132691194, 182.45051589413404, 180.84949114744327, 179.25431986325972, 177.66540065742663, 176.08312784971275, 174.507891330212, 172.9400764276922, 171.380063779943, 169.8282292061724, 168.28494358150033, 166.75057271359714, 165.22547722151387, 163.71001241675, 162.20452818660416, 160.7093688798512, 159.22487319479012, 157.7513740697028, 156.28919857576776, 154.83866781246599, 153.40009680552092, 151.97379440740838, 150.5600632004756, 149.15919940270356, 147.7714927761496, 146.3972265381023, 145.03667727498305, 143.69011485902496, 142.35780236776043, 141.03999600634617, 139.7369450327547, 138.44889168585894, 137.17607111643582, 135.9187113211147, 134.67703307929244, 133.45124989303955, 132.2415679300169, 131.04818596942454, 129.8712953509996, 128.7110799270829, 127.56771601776882, 126.44137236915455, 125.33221011470191, 124.24038273972502, 123.16603604901417, 122.10930813760703, 121.07032936471496, 120.04922233081285, 119.04610185789767, 118.06107497292207, 117.09424089440527, 116.14569102222487, 115.21550893058972, 114.30377036419469, 113.41054323755486, 112.53588763751733, 111.6798558289465, 110.84249226357666, 110.0238335920271, 109.22390867896999, 108.44273862144392, 107.68033677030088, 106.93670875477693, 106.21185251017212, 105.50575830862701, 104.81840879297914, 104.14977901368441, 103.4998364687838, 102.86854114689851, 102.25584557323127, 101.6616948585541, 101.08602675115873, 100.52877169174684, 99.98985287123433, 99.4691862914441, 98.96668082865975, 98.48223830001207, 98.0157535326683, 97.5671144357941, 97.13620207525591, 96.72289075103106, 96.3270480772921, 95.94853506512912, 95.58720620787582, 95.24290956900012, 94.91548687252337, 94.60477359592687, 94.31059906550763, 94.03278655414043, 93.77115338140568, 93.52551101603883, 93.29566518065843, 93.08141595872712, 92.8825579037008, 92.69888015031836, 92.53016652798541, 92.37619567620338, 92.23674116199481, 92.1115715992752, 92.00045077012076, 91.90313774788066, 91.81938702208147, 91.74894862507134, 91.69156826035015, 91.64698743253169, 91.6149435788825, 91.59517020238319, 91.58739700625426, 91.59135002989221, 91.60675178615617, 91.63332139995019, 91.67077474804, 91.71882460004855, 91.77718076056846, 91.84555021233425, 91.92363726039221, 92.0111436772093, 92.10776884865928, 92.21320992082525, 92.32716194755778, 92.44931803872592, 92.57936950910012, 92.71700602780444, 92.86191576827584, 93.01378555866759, 93.17230103263483, 93.33714678043866, 93.50800650030608, 93.68456314998312, 93.86649909841707, 94.05349627750563, 94.24523633384956, 94.4414007804448, 94.64167114825281, 94.84572913758356, 95.05325676923127, 95.26393653529662, 95.47745154963634, 95.69348569787402, 95.9117237869135, 96.13185169388923, 96.35355651449446, 96.57652671062408, 96.80045225727152, 97.02502478861835, 97.24993774325621, 97.47488650848061, 97.69956856359693, 97.92368362217871, 98.1469337732199, 98.36902362112178, 98.58966042445704, 98.80855423345308, 99.02541802613757, 99.23996784309028, 99.45192292074417, 99.66100582318188, 99.86694257237185, 100.06946277679049, 100.26829975837677, 100.46319067776719, 100.65387665775874, 100.84010290494824, 101.02161882949844, 101.1981781629805, 101.36953907424484, 101.53546428327056, 101.69572117294842, 101.85008189874914, 101.99832349623264, 102.14022798635258, 102.27558247851373, 102.40417927133808, 102.52581595109883, 102.64029548778052, 102.7474263287261, 102.84702248983149, 102.93890364425015, 103.02289520856988, 103.09882842642732, 103.16654044952402, 103.2258744160112, 103.27667952620995, 103.31881111563585, 103.35213072529685, 103.37650616923567, 103.39181159928837, 103.39792756703143, 103.39474108289205, 103.3821456723969, 103.36004142953534, 103.32833506721451, 103.28693996478594, 103.2357762126227, 103.17477065372906, 103.10385692236403, 103.02297547966377, 102.93207364624637, 102.83110563178613, 102.72003256154376, 102.59882249984197, 102.46745047047536, 102.32589847404664, 102.17415550222054, 102.01221754888971, 101.84008761824722, 101.65777572976171, 101.46529892005275, 101.26268124166495, 101.04995375874067, 100.8271545395929, 100.59432864618033, 100.35152812048858, 100.09881196782264, 99.83624613701663, 99.56390349756857, 99.28186381370881, 98.99021371541244, 98.68904666636637, 98.37846292890465, 98.05856952592472, 97.72948019980032, 97.39131536830712, 97.04420207757857, 96.68827395211073, 96.32367114183585, 95.95054026628581, 95.56903435586797, 95.17931279027688, 94.78154123406617, 94.37589156940689, 93.96254182605892, 93.54167610858414, 93.11348452082996, 92.67816308771393, 92.23591367434116, 91.78694390248657, 91.33146706447648, 90.86970203450318, 90.40187317740947, 89.92821025497912, 89.44894832977167, 88.96432766654033, 88.47459363127243, 87.979996587894, 87.48079179268004, 86.97723928641305, 86.46960378433344, 85.95815456392707, 85.443165350595, 84.92491420125171, 84.40368338589917, 83.87975926722517, 83.35343217827423, 82.82499629824167, 82.29474952643989, 81.76299335448972, 81.23003273678786, 80.69617595930357, 80.16173450675713, 79.62702292823566, 79.09235870129947, 78.55806209463593, 78.02445602931458, 77.49186593870276, 76.96061962709643, 76.43104712712571, 75.90348055599232, 75.37825397059716, 74.85570322161875, 74.33616580660086, 73.81998072210966, 73.30748831502075, 72.79903013299707, 72.29494877421878, 71.79558773642691, 71.30129126534108, 70.81240420251544, 70.32927183269389, 69.85223973072743, 69.38165360811563, 68.91785915923663, 68.46120190732722, 68.01202705027777, 67.5706793063028, 67.13750275955371, 66.71284070573421, 66.29703549778432, 65.89042839169394, 65.49335939251154, 65.10616710060968, 64.72918855827217, 64.36275909666475, 64.0072121832523, 63.6628792697267, 63.33008964050698, 63.00917026187463, 62.70044563180588, 62.40423763056344, 62.120865372109805, 61.85064505640253, 61.5938898226329, 61.35090960346909, 61.122010980364394, 60.90749703998951, 60.7076672318488, 60.52281722714032, 60.353238778916804, 60.19921958360773, 60.061043143957235, 59.93898863343786, 59.83333076219394, 59.74433964457332, 59.67228066829935, 59.61741436534067, 59.57999628453088, 59.560276865992584, 59.55850131741757, 59.57490949225495, 59.609735769858744, 59.6632089376456, 59.73555207531129, 59.82698244115489, 59.937711360559135, 60.06794411667392, 60.21787984334874, 60.38771142035906, 60.57762537097207, 60.78780176189505, 61.01841410564818, 61.26962926540382, 61.54160736233349, 61.834501685500875, 62.14845860434158, 62.48361748376446, 62.840110601913814, 63.218063070626, 63.617592758616766, 64.03881021743052, 64.48181861018597, 64.94671364314756, 65.43358350015473, 65.94250877993584, 66.47356243633607, 67.02680972148507, 67.60230813193107, 68.20010735776418, 68.82024923475308, 69.46276769951655, 70.12768874775144, 70.8150303955353, 71.52480264372285, 72.25700744545294, 73.01163867678284, 73.78868211046274, 74.58811539286533, 75.40990802408186, 76.25402134119541, 77.12040850474192, 78.00901448836578, 78.91977607167848, 79.85262183632463, 80.80747216526179, 81.78423924525524, 82.7828270725911, 83.80313146200743, 84.84504005884403, 85.90843235440738, 86.99317970454887, 88.09914535145069, 89.22618444861536, 90.37414408904971, 91.54286333663671, 92.73217326068449, 93.94189697364295, 95.17184967197421, 96.42183868016512, 97.69166349786573, 98.98111585013987, 100.28997974080823, 101.6180315088677, 102.96503988796631, 104.33076606891302, 105.71496376520119, 107.11737928152144, 108.53775158524019, 109.97581238081764, 111.43128618713962, 112.90389041773412, 114.393335463844, 115.8993247803252, 117.42155497434042, 118.95971589681362, 120.51349073661392, 122.08255611743232, 123.66658219731747, 125.26523277083137, 126.8781653737895, 128.50503139054405, 130.1454761637729, 131.79913910673073, 133.46565381792266, 135.14464819815566, 136.83574456992542, 138.53855979909252, 140.25270541880323, 141.97778775560758, 143.71340805772738, 145.45916262542616, 147.21464294343167, 148.97943581536015, 150.75312350009227, 152.5352838500492, 154.32549045131606, 156.123312765559, 157.9283162736831, 159.7400626211762, 161.55810976508212, 163.38201212254995, 165.21132072089938, 167.0455833491484, 168.88434471094246, 170.72714657882932, 172.57352794981838, 174.42302520216717, 176.27517225333276, 178.12950071903055, 179.98554007333598, 181.8428178097717, 183.70085960331488, 185.55918947326558, 187.41732994691142, 189.2748022239271, 191.13112634144534, 192.98582133973582, 194.83840542842827, 196.688396153216, 198.53531056297587, 200.37866537724108, 202.21797715396036, 204.05276245748115, 205.8825380266917, 207.70682094325556, 209.52512879987682, 211.33697986852798, 213.14189326857826, 214.9393891347557, 216.72898878488002, 218.5102148872995, 220.28259162796957, 222.04564487710638, 223.79890235535365, 225.54189379939575, 227.27415112695584, 228.99520860111318, 230.70460299387798, 232.40187374895925, 234.0865631436634, 235.75821644986104, 237.4163820939602, 239.0606118158232, 240.6904608265663, 242.30548796518144, 243.90525585391964, 245.48933105237495, 247.05728421021036, 248.6086902184669, 250.1431283593961, 251.66018245475982, 253.1594410125379, 254.64049737198934, 256.1029498470083, 257.54640186772264, 258.97046212027647, 260.37474468474693, 261.7588691711378, 263.12246085340075, 264.46515080142984, 265.7865760109807, 267.0863795314611, 268.3642105915475, 269.6197247225749, 270.85258387965587, 272.06245656047884, 273.2490179217434, 274.4119498931835, 275.550941289138, 276.6656879176237, 277.7558926868693, 278.8212657092691, 279.8615244027161, 280.8763935892763, 281.86560559116464, 282.82890032398745, 283.7660253872141, 284.6767361518431, 285.56079584523025, 286.4179756330443, 287.2480546983202, 288.0508203175783, 288.82606793398196, 289.5736012275032, 290.2932321820715, 290.9847811496792, 291.64807691141857, 292.28295673542874, 292.8892664317279, 293.46686040391205, 294.0156016977003, 294.53536204630655, 295.02602191262304, 295.48747052819704, 295.9196059289882, 296.3223349878922, 296.69557344401767, 297.03924592870777, 297.35328598829364, 297.63763610357466, 297.8922477060159, 298.11708119065804, 298.31210592573547, 298.47730025899875, 298.6126515207396, 298.71815602351813, 298.79381905859293, 298.83965488905505, 298.85568673967083, 298.8419467834359, 298.7984761248483, 298.72532477990626, 298.6225516528396, 298.4902245095846, 298.3284199480124, 298.13722336492435, 297.91672891982654, 297.66703949549884, 297.38826665537476, 297.08053059774807, 296.743960106826, 296.37869250064784, 295.9848735758901, 295.5626575495805, 295.1122069977434, 294.63369279100243, 294.12729402716457, 293.59319796081365, 293.031599929941, 292.4427032796418, 291.8267192829087, 291.183867058553, 290.514373486287, 289.81847311900003, 289.09640809226397, 288.348428031104, 287.5747899540709, 286.77575817465345, 285.95160420006926, 285.1026066274755, 284.2290510376388, 283.3312298861073, 282.40944239192805, 281.4639944239528, 280.49519838477806, 279.5033730923644, 278.4888436593826, 277.45194137033263, 276.39300355648606, 275.3123734686998, 274.21040014815037, 273.0874382950426, 271.9438481353411, 270.7799952855794, 269.596250615798, 268.3929901106673, 267.170594728848, 265.92945026064626, 264.6699471840168, 263.3924805189739, 262.09744968046465, 260.7852583297641, 259.4563142244488, 258.1110290670099, 256.7498183521625, 255.37310121291443, 253.9813002654509, 252.57484145289908, 251.15415388803223, 249.7196696949759, 248.27182384997633, 246.81105402129594, 245.33780040829686, 243.85250557977537, 242.35561431161244, 240.84757342380024, 239.32883161691234, 237.79983930807856, 236.2610484665305, 234.71291244877966, 233.1558858334953, 231.5904242561438, 230.016984243457, 228.43602304778983, 226.84799848143612, 225.25336875096497, 223.65259229164215, 222.04612760200126, 220.43443307862975, 218.81796685123254, 217.19718661803927, 215.57254948161744, 213.94451178515578, 212.31352894928233, 210.68005530947926, 209.0445439541581, 207.407446563458, 205.76921324883023, 204.13029239346943, 202.49113049365582, 200.85217200106632, 199.21385916612005, 197.57663188241372, 195.94092753231178, 194.30718083374734, 192.67582368829503, 191.04728503057316, 189.42199067903482, 187.80036318820225, 186.18282170240607, 184.56978181108028, 182.96165540567296, 181.35885053822514, 179.76177128167313, 178.17081759192695
	
	};
}


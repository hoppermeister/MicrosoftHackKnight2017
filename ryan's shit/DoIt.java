import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import org.json.JSONObject;

public class DoIt {
	public static void main(String[] args) throws IOException {
		File f = new File("pokestops.json");
		FileInputStream inp = new FileInputStream(f);
		byte[] bf = new byte[(int) f.length()];
		inp.read(bf);
		String fileContent = new String(bf, "UTF-8");

		JSONObject obj = new JSONObject(fileContent);

		List<double[]> locs = new ArrayList<double[]>();
		List<String> names = new ArrayList<String>();

		for (String key : obj.keySet()) {
			String a = obj.getJSONObject(key).getString("poke_lat");
			String b = obj.getJSONObject(key).getString("poke_lng");
			a = a.substring(0, 2) + "." + a.substring(2);
			b = b.substring(0, 3) + "." + b.substring(3);

			locs.add(new double[] { Double.parseDouble(a), Double.parseDouble(b) });
			names.add(obj.getJSONObject(key).getString("poke_title"));
		}

		PrintWriter out = new PrintWriter(new FileWriter(new File("adj.txt")));
		for(int i = 0; i < locs.size(); i++) {
			for(int j = i + 1; j < locs.size(); j++) {
				double[] a = locs.get(i), b = locs.get(j);
				InputStream in = new URL(String.format("http://dev.virtualearth.net/REST/V1/Routes/Walking?wp.0=%f,%f&wp.1=%f,%f&optmz=distance&key=AmunM5dqdTYSTdKKi59eed45MbZNDSjLUu93J0nLO_u9gfaPS7085ukHhhoCkatw", a[0], a[1], b[0], b[1])).openStream();
				BufferedReader read = new BufferedReader(new InputStreamReader(in));
				StringBuilder sb = new StringBuilder();
				String line;
				while((line = read.readLine()) != null) {
					sb.append(line);
					sb.append("\n");
				}
				
				obj = new JSONObject(sb.toString());
				int time = obj.getJSONArray("resourceSets").getJSONObject(0).getJSONArray("resources").getJSONObject(0).getInt("travelDuration");
				System.out.printf("From %s to %s: %d%n", names.get(i), names.get(j), time);
				out.printf("From %s to %s: %d%n", names.get(i), names.get(j), time);
			}
		}
		out.close();
	}
}
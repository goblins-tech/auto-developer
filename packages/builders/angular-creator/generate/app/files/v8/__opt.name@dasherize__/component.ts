import { Component } from "@angular/core";

@Component({
  selector: "<%=opt.selector%>",
  templateUrl: "./index.html",
  styleUrls: ["./style.<%=opt.styleExt%>"]
})
export class AppComponent {
  title = "<%=opt.name%>";
}

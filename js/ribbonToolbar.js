/*

   My Crazy Microsoft styled Ribbon Toolbar Component


 */


/********************************************************************************
 ********************************************************************************/
function OrvRibbonToolbar(sId) {
	let tb = this;   // tb is short for ToolBar!  :P
	const ctr = $("#"+sId)[0];
	let tabsByIndex = [];
	let itemsByUniqueId = [];
	const RIGHT_MOUSE_BUTTON = 2;

	let nNextUniqueIdNum = 1;
	let w,h;
	let nSelTabIndex = -1;
	let bRibbonEventsAdded = false;
	
	let bShiftPressed = false;
	let bCtrlPressed = false;
	let bAltPressed = false;
	let bCmdPressed = false;  // Apple Mac related keystroke

	tb.ribbonHeight = 118;
	
	ctr.className = "ribbonO";

	/********************************************************************************
	 ********************************************************************************/
	tb.render = function() {
		console.log("the Ribbon Toolbar's render() method was called.")
		
		w = window.innerWidth;
		h = window.innerHeight;
		ctr.style.width = (w)+"px";
		tb.tabLeft = 48;

		const nMax = tabsByIndex.length;
		const s = [];
		
		console.log("about to loop through tab objects in for loop...")
		for (let n=0;n<nMax;n++) {
			console.log("n="+n+"   nMax="+nMax);
			const rbTab = tabsByIndex[n];
			s.push(rbTab.render(n));
		} // next n

		ctr.innerHTML = s.join("");

		if (!bRibbonEventsAdded) {
			// Tag: #eventHandlerSetup
			ctr.addEventListener('click', handleClickEvent);
		//	ctr.addEventListener('mousedown', handleMouseDownEvent);
			ctr.addEventListener('contextmenu', handleContextMenuEvent);
			bRibbonEventsAdded = true;
		} // end if

	} // end of tb.render method

	/********************************************************************************
	 ********************************************************************************/
	tb.addTab = function(params) {
		const rbTab = {};

		console.log("adding new ribbon tab via addTab() method")
		rbTab.objType = "tab";
		rbTab.caption = getVal(params,"caption","Tab "+(tabsByIndex.length+1));
		rbTab.groupsByIndex = [];
		rbTab.visible = getVal(params,"visible",true);
		rbTab.uniqueId = getUniqueId();

		tabsByIndex.push(rbTab);
		itemsByUniqueId[rbTab.uniqueId] = rbTab;

		if (nSelTabIndex === -1) {
			nSelTabIndex = tabsByIndex.length - 1;
		} // end if


		/********************************************************************************
	 	 ********************************************************************************/
		rbTab.render = function(nIdx) {
			const s = [];
			const rbTab2 = this;
			const nMax = rbTab2.groupsByIndex.length;
			const Q = '"';
			let nLeft1 = tb.tabLeft;
			let nLeft2 = 3;
			const nCaptionMargin = 12;
			const szInfo = getTextSize({text:rbTab.caption});
			let nTabWidth = szInfo.width + (nCaptionMargin * 2);

			console.log("rendering a ribbon tab")
			
			let sStyle = "style="+Q+"left:"+(nLeft1)+"px;";

			if (nTabWidth>36) {
				sStyle = sStyle+"width:"+(nTabWidth)+"px;";
			} else {
				nTabWidth = 36
			} // end if

			tb.tabLeft = tb.tabLeft + nTabWidth + 2;
			sStyle = sStyle+Q+" ";
			

			if (nIdx === nSelTabIndex) {
				console.log("rendering the Active ribbon tab")
				// render the active tab
				s.push("<div ");
				s.push("class='ribbonTabSel' ");
				s.push(sStyle);
				s.push(">");
				s.push(rbTab.caption);
				s.push("</div>");

				console.log("initially, nLeft2="+nLeft2);

				// render the groups of the active tab
				console.log("--- rendering the Content of the Active ribbon tab")
				s.push("<div class='ribbonTabContentContainer' ");
				s.push("style="+Q+"width:"+(w-4)+"px;"+Q+" ");
				s.push(">");
				for (let n=0;n<nMax;n++) {
					const tbGroup = rbTab2.groupsByIndex[n];
					s.push(tbGroup.render(nLeft2));
					nLeft2 = nLeft2 + tbGroup.width + 3;
					console.log("   nLeft2 now equals: "+nLeft2);
				} // next n
				s.push("</div>");
			} else {
				// render the inactive tab
				console.log("rendering an inactive ribbon tab")
				s.push("<div ");
				s.push("class='ribbonTab' ");
				s.push(sStyle);
				s.push(" data-indexNum='"+nIdx+"' ");
				s.push(">");
				s.push(rbTab.caption);
				s.push("</div>");
			} // end if

			return s.join("");
		} // end of rbTab.render method



		/********************************************************************************
		 ********************************************************************************/
		rbTab.addGroup = function(params2) {
			const tbGroup = {};

			console.log("adding new ribbon group")
			tbGroup.objType = "group";
			tbGroup.idx = rbTab.groupsByIndex.length;
			tbGroup.caption = getVal(params2,"caption","Group "+(tbGroup.idx+1));
			tbGroup.visible = getVal(params2,"visible",true);
			tbGroup.width = 80;
			tbGroup.uniqueId = getUniqueId();
			itemsByUniqueId[tbGroup.uniqueId] = tbGroup;

			rbTab.groupsByIndex.push(tbGroup);


			tbGroup.controlsByIndex = [];

			/*
			   note that calling routine calculates the value of nLeft.
		     */
			tbGroup.render = function(nLeft) {
				console.log("render ribbon group!")
				const s = [];
				const Q = '"';
				

				let sGroupControlMarkup = [];
				let nLeft2 = 3;
				let nTop2 = 3;
				let nMax2 = tbGroup.controlsByIndex.length;

				for (let x2=0;x2<nMax2;x2++) {
					const ctrl = tbGroup.controlsByIndex[x2];
					sGroupControlMarkup.push(ctrl.render(nLeft2, nTop2));

					nLeft2 = nLeft2 + ctrl.width + 3;

					if (nLeft2 > tbGroup.width) {
						tbGroup.width = nLeft2+3;
					} // end if

				} // next x2

				let sStyle = " style="+Q;
				sStyle = sStyle+"left:"+(nLeft)+"px;";
				sStyle = sStyle+"width:"+(tbGroup.width)+"px;";
				sStyle = sStyle+Q;

				s.push("<div class='ribbonTabGroup' ");
				s.push(sStyle);
				s.push(" data-indexNum='"+tbGroup.idx+"' ");
				s.push(">");

				s.push(sGroupControlMarkup.join(""));

				s.push("<div class='ribbonTabGroupCaption' ");
				s.push(">");
				s.push(tbGroup.caption);
				s.push("</div>"); // closing Div of tab Group's Caption

				s.push("</div>"); // closing Div of tab Group
				console.log("-- > render ribbon group completed")

				//console.log(s.join(""))
				return s.join("");
			} // end of tbGroup.render method

			/********************************************************************************
		     ********************************************************************************/
			tbGroup.addSeparator = function(params3) {
				const ctrl = {};
				ctrl.objType = "separator";
				ctrl.ctrlType = "separator";
				ctrl.visible = getVal(params3,"visible",true);
				ctrl.uniqueId = getUniqueId();

				itemsByUniqueId[ctrl.uniqueId] = ctrl;

				tbGroup.controlsByIndex.push(ctrl);

				return ctrl;
			} // end of addSeparator() method

			/********************************************************************************
		     ********************************************************************************/
			tbGroup.addButton = function(params3, buttonGroupObj) {
				const ctrl = {};
				ctrl.objType = "button";
				ctrl.ctrlType = "button";
				ctrl.uniqueId = getUniqueId();
				ctrl.size = getVal(params3,"size","Large"); // "Large" or "Normal"
				ctrl.caption = getVal(params3,"caption","");
				ctrl.toggleButton = getVal(params3,"toggleButton",false);
				ctrl.toggled = getVal(params3,"toggled",false); // only relevant if toggleButton is set to true.
				ctrl.enabled = getVal(params3,"enabled",true);
				ctrl.visible = getVal(params3,"visible",true);
				ctrl.screenTip = getVal(params3,"screenTip","");
				ctrl.superTip = getVal(params3,"superTip","");				
				addingCallFunc(ctrl,"click",params3);

				ctrl.width = 50;

				if (ctrl.size === "Normal") {
					ctrl.width = 25;
				} // end if

				itemsByUniqueId[ctrl.uniqueId] = ctrl;

				if (typeof buttonGroupObj=== "undefined") {
					tbGroup.controlsByIndex.push(ctrl);
				} else {
					buttonGroupObj.controlsByIndex.push(ctrl);
				} // end if / else

				/********************************************************************************
		     	 ********************************************************************************/
				ctrl.render = function(nLeft, nTop) {
					const s=[];
					const Q='"';
					let sTogglButtonPrefix = "";
					let sToggleStateSuffix = "";

					if (ctrl.toggleButton) {
						sTogglButtonPrefix = "Toggle";
						sToggleStateSuffix = "Untoggled";

						if (ctrl.toggled) {
							sToggleStateSuffix = "Toggled";
						} // end if

					} // end if

					// Opening tag of overall button:
					s.push("<div class='ribbon");
					s.push(ctrl.size+sTogglButtonPrefix+"Button"+sToggleStateSuffix);
					s.push("' ");
					s.push("style="+Q);
					s.push("left:"+(nLeft)+"px;");
					s.push("top:"+(nTop)+"px;");
					s.push(Q);

					s.push(" data-uniqueId='"+ctrl.uniqueId+"' ");
					s.push(">");

					if (ctrl.caption.length > 0 && ctrl.size === "Large") {
						s.push("<div class='ribbonLargeButtonCaption'>");
						s.push(ctrl.caption);
						s.push("</div>"); // closing: ribbonLargeButtonCaption
					} // end if

					s.push("</div>"); // closing tag of overall button

					return s.join("");
				} // end of ctrl.render method for a Button


				return ctrl;  // return a ribbon button object

			} // end of addButton() method			




			/********************************************************************************
			 *  button groups are for grouping 'normal' buttons not 'large' buttons
		     ********************************************************************************/
			tbGroup.addButtonGroup = function(params3) {
				const ctrl2 = {};
				ctrl2.controlsByIndex = []; // child controls
				ctrl2.objType = "buttonGroup";
				ctrl2.ctrlType = "buttonGroup";
				ctrl2.uniqueId = getUniqueId();
				ctrl2.align = getVal(params3,"align","horizontally"); // "horizontally" or "vertically"
				ctrl2.visible = getVal(params3,"visible",true);
				tbGroup.controlsByIndex.push(ctrl2);

				itemsByUniqueId[ctrl2.uniqueId] = ctrl2;

				ctrl2.addButton = function(params4) {
					return tbGroup.addButton(params4, ctrl2);
				} // end of addButton method for a button group!

				return ctrl2;
			} // end of addSeparator() method


			/********************************************************************************
		     ********************************************************************************/
			tbGroup.addCheckBox = function(params3) {
				const ctrl = {};
				ctrl.objType = "checkbox";
				ctrl.ctrlType = "checkbox";
				ctrl.uniqueId = getUniqueId();
				ctrl.value = getVal(params3,"value",false);
				ctrl.caption = getVal(params3,"caption","");
				ctrl.enabled = getVal(params3,"enabled",true);
				ctrl.visible = getVal(params3,"visible",true);
				ctrl.screenTip = getVal(params3,"screenTip","");
				ctrl.superTip = getVal(params3,"superTip","");				

				itemsByUniqueId[ctrl.uniqueId] = ctrl;

				addingCallFunc(ctrl,"change",params3);
				tbGroup.controlsByIndex.push(ctrl);

				return ctrl;
			} // end of addCheckBox() method	



			/********************************************************************************
		     ********************************************************************************/
			tbGroup.addTextBox = function(params3) {
				const ctrl = {};
				ctrl.objType = "textbox";
				ctrl.ctrlType = "textbox";
				ctrl.uniqueId = getUniqueId();
				ctrl.maxSize = getVal(params3,"maxSize",60);
				ctrl.value = getVal(params3,"value","");
				ctrl.caption = getVal(params3,"caption","");
				ctrl.placeholder = getVal(params3,"placeholder","");
				ctrl.enabled = getVal(params3,"enabled",true);
				ctrl.visible = getVal(params3,"visible",true);
				ctrl.screenTip = getVal(params3,"screenTip","");
				ctrl.superTip = getVal(params3,"superTip","");	
				
				itemsByUniqueId[ctrl.uniqueId] = ctrl;

				addingCallFunc(ctrl,"focus",params3);
				addingCallFunc(ctrl,"blur",params3);
				addingCallFunc(ctrl,"change",params3);
				addingCallFunc(ctrl,"paste",params3);

				tbGroup.controlsByIndex.push(ctrl);

				return ctrl;
			} // end of addTextBox() method		


			/********************************************************************************
		     ********************************************************************************/
			function addingCallFunc(ctrl,sEvent,params3) {
				if (typeof params3["on"+sEvent] === "function") {
					ctrl["on"+sEvent] = params3["on"+sEvent];
				} // end if

			} // end of function addingCallFunc()

			return tbGroup;

		} // end of rbTab.addGroup method


		return rbTab;
	} // end of tb.addTab method



	/********************************************************************************
	 ********************************************************************************/
	function getUniqueId() {
		const sId = "rbId"+nNextUniqueIdNum;
		nNextUniqueIdNum = nNextUniqueIdNum + 1;
		return sId;
	} // end of function getUniqueId()


	/********************************************************************************
	 * 
	 *   called by:  checkEventItem()
	 ********************************************************************************/
	function buildBaseInputParam(sEvent,tbObj,domNode) {
		console.log("buildBaseInputParam() was called.");
		const baseInputParam = {};
		const now = new Date();

		baseInputParam.msTimeStamp = now.getTime();
		baseInputParam.eventName = sEvent;
		baseInputParam.toolbarObj = tbObj;
		baseInputParam.domNode = domNode;

		return baseInputParam;
	} // end of function buildBaseInputParam()



	/********************************************************************************
	 ********************************************************************************/
	function checkEventItem(evt, sEvent) {
		console.log("checkEventItem() was called.");
		const itm = evt.srcElement;

		if (typeof itm.dataset.uniqueid !== "string") {
			console.log("DOM node affected does not have special unique id. So it is not relevant. Exiting checkEventItem()...");
			return; // item is not relavent
		} // end if

		const sUniqueId = itm.dataset.uniqueid;
		const tbObj = itemsByUniqueId[sUniqueId];
		const sObjType = tbObj.objType;

		if (sObjType === "button" && sEvent === "click") {
			console.log("a toolbar button was clicked on");
			if (tbObj.enabled && typeof tbObj.onclick === "function") {
				console.log(" === the button enabled and has a function to call...");
				const fn = tbObj.onclick;
				const clickInfo = buildBaseInputParam(sEvent,tbObj,itm);
				const now = new Date();

				if (!tbObj.toggleButton) {
					// Standard button type:
					console.log("about to call specified button click function...");
					fn(clickInfo);
				} else {
					// Toggle button type:

					// before doing anything, toggle the button state value!
					if (!tbObj.toggled) {
						tbObj.toggled = true;
					} else {
						tbObj.toggled = false;
					} // end if / else

					clickInfo.toggled = tbObj.toggled; // add additional property value!

					console.log("about to call specified toggle button click function...");
					fn(clickInfo);
				} // end if / else
			} // end if button is enabled and has a function to call

		} // end if item in question was clicked on and is a button

	} // end of function checkEventItem()


	/********************************************************************************
	 * see: #eventHandlerSetup (via Search)
	 ********************************************************************************/
	function handleMouseDownEvent(evt) {
		console.log("mousedown event occurred on ribbon");
		
		if (evt.buttons === RIGHT_MOUSE_BUTTON) {
			return;
		} // end if

	} // end of function handleMouseDownEvent()


	/********************************************************************************
	 * see: #eventHandlerSetup (via Search)
	 * 
	 * we want to suppress the context menu on ribbon so it feels more like 
	 * a native app!
	 ********************************************************************************/
	function handleContextMenuEvent(evt) {
		console.log("contextmenu event occurred on ribbon");

		if (event.stopPropagation) {
			console.log("calling: event.stopPropagation()");
			event.stopPropagation();
		} // end if

		if (event.preventDefault) {
			console.log("calling: event.preventDefault()");
			evt.preventDefault();
		} // end if

		console.log("about to return false");

		return false;
	} // end of function handleContextMenuEvent()




	/********************************************************************************
	 * handle any click event on the toolbar ribbon
	 * see: #eventHandlerSetup
	 ********************************************************************************/
	function handleClickEvent(evt) {
		console.log("ribbon was clicked");

		const itm = evt.srcElement;

		if (itm.className === "ribbonTab") {
			handleRibbonTabSel(itm);
			return;
		} // end if

		checkEventItem(evt, "click");
		
	} // end of function handleClickEvent()

	

	/********************************************************************************
	 * see: #eventHandlerSetup (via Search)
	 ********************************************************************************/
	function handleFocusEvent(evt) {
		console.log("control on ribbon got focus on the UI");

		checkEventItem(evt, "focus");
	} // end of function handleFocusEvent()



	/********************************************************************************
	 * see: #eventHandlerSetup  (via Search)
	 ********************************************************************************/
	function handleChangeEvent(evt) {
		checkEventItem(evt, "change");
	} // end of function handleChangeEvent()


	/********************************************************************************
	 * see: #eventHandlerSetup (via Search)
	 ********************************************************************************/
	function handleBlurEvent(evt) {
		checkEventItem(evt, "blur");
	} // end of function handleBlurEvent()



	/********************************************************************************
	 * see: #eventHandlerSetup (via Search)
	 ********************************************************************************/
	function handleKeyDownEvent(evt) {
		checkEventItem(evt, "keydown");
	} // end of function handleKeyDownEvent()



	/********************************************************************************
	 * see: #eventHandlerSetup (via Search)
	 ********************************************************************************/
	function handleKeyUpEvent(evt) {
		checkEventItem(evt, "keyup");
	} // end of function handleKeyUpEvent()



	/********************************************************************************
	 ********************************************************************************/
	function getVal(params,sParam,defVal) {
		if (!params) {
			params = {};
		} // end if

		if (params[sParam]) {
			return params[sParam];
		} else {
			return defVal;
		} // if / else

	} // end of function getVal()


	/********************************************************************************
	 ********************************************************************************/
	function getTextSize(params) {
		const sText = getVal(params,"text","** No Text **");
		const sFontName = getVal(params,"fontName","Calibri, Candara, Segoe, 'Segoe UI', Optima, Arial, sans-serif");
		const nFontSize = getVal(params,"fontSize",8.7);
		const bBold = getVal(params,"bold",false);
		const bItalics = getVal(params,"italics",false);
		let ribbonTextCheckNd = $("#ribbonTextCheck")[0];
		const sizeInfo = {};

		if (typeof ribbonTextCheckNd === "undefined") {
			ribbonTextCheckNd = document.createElement("span");
			ribbonTextCheckNd.id = "ribbonTextCheck";
			// note that CSS needed for this is already set up in "ribbon.css" !
			// visibility is set to "hidden" in the selector.
			document.body.appendChild(ribbonTextCheckNd);
		} // end if

		ribbonTextCheckNd.style.fontFamily = sFontName;
		ribbonTextCheckNd.style.fontSize = (nFontSize)+"pt";

		ribbonTextCheckNd.textContent = sText;
		sizeInfo.width = ribbonTextCheckNd.clientWidth;
		sizeInfo.height = ribbonTextCheckNd.clientHeight;

		return sizeInfo;

	} // end of function getTextSize()





	/********************************************************************************
	 *  a reminder... dataset property names are Always converted to All lowercase!
	 * 
	 ********************************************************************************/
	function handleRibbonTabSel(itm) {
		nSelTabIndex = itm.dataset.indexnum - 0; // new selected tab!
		tb.render(); // have it appear

	} // end of function handleRibbonTabSel()

// #############################################################################
} // end of function OrvRibbonToolbar()
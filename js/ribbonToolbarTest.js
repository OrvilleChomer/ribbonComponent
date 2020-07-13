
	let tb;
	let w,h;

	function pageSetup(event) {
		console.log("**** pageSetup() called on load event!")
		//console.clear();
		setupRibbon()
		pageResize(event);
	} // end of function pageSetup()


	function setupRibbon() {
		console.log("***** setupRibbon() called in test js file")
		tb = new OrvRibbonToolbar("ribbon");
		const homeTab = tb.addTab({caption:"Home"});
		const insertTab = tb.addTab({caption:"Insert"});
		const pageLayoutTab = tb.addTab({caption:"Page Layout"});
		const referencesTab = tb.addTab({caption:"References"});
		const mailingsTab = tb.addTab({caption:"Mailings"});
		const testingTab = tb.addTab({caption:"Dev Testing"});

		const clipboardGroup = homeTab.addGroup({caption:"Clipboard"});
		clipboardGroup.addButton({caption:"Test 1",onclick:testFunc1});
		clipboardGroup.addButton({caption:"Test 2",onclick:testFunc2});
		clipboardGroup.addButton({caption:"Test 3",onclick:testFunc3});

		const fontGroup = homeTab.addGroup({caption:"Font"});

		const entitiesGroup = insertTab.addGroup({caption:"Entities"});
		const importGroup = insertTab.addGroup({caption:"Import"});
	} // end of function setupRibbon()


	function testFunc1() {
		alert("test 1 button was clicked");
	}

	function testFunc2() {
		alert("test 2 button was clicked");
	}

	function testFunc3() {
		alert("test 3 button was clicked");
	}

	function pageResize(event) {
		console.log("**** pageResize() called on resize event!")
		tb.render();
	} // end of function pageResize()


	window.addEventListener('load', pageSetup);
	window.addEventListener('resize', pageResize);

---
layout: default
title: Provenance of function executions
nav: |
    <li class="page-scroll">
        <a href="#about">About</a>
    </li>
    <li class="page-scroll">
        <a href="#example">Example</a>
    </li>
---

<!-- Header -->
<header>
    <div class="container">
        <div class="row">
            <div class="col-lg-12">
                <!--<img class="img-responsive" src="img/profile.png" alt="">-->
                <div class="intro-text">
                    <span class="name">Provenance of function executions</span>
                    <hr class="star-light">
                    <span class="skills"><a href="http://ceur-ws.org/Vol-1931/paper-05.pdf" target="_blank">Paper</a> accepted at <a href="https://semsci.github.io/semSci2017/" target="_blank">SemSci</a> @ <a href="https://iswc2017.semanticweb.org" target="_blank">ISWC2017</a></span>
                </div>
            </div>
        </div>
    </div>
</header>

<!-- About Section -->
<section id="about">
    <div class="container">
        <div class="row">
            <div class="col-lg-12 text-center">
                <h2>About</h2>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-8 col-lg-offset-2">
                <p>
                    A large part of scientific output entails computational experiments,
                    e.g., processing data to generate new data.
                    However, this generation process
                    is only documented in human-readable form or as a software repository.
                    This inhibits reproducibility and comparability,
                    as current documentation solutions do not provide detailed metadata
                    and rely on the availability of specific software environments.
                </p>
                <p>
                    Here, we propose an automatic capturing mechanism
                    for interchangeable and implementation independent
                    metadata and provenance
                    that includes data processing.
                    Using declarative mapping documents to describe the computational experiment,
                    term-level provenance can be automatically captured,
                    for both schema and data transformations,
                    and storing both the used software tools as the input-output pairs of the data processing executions.
                </p>
                <p>
                    More specifically, this page shows how this provenance is captured
                    applied to mapping documents described using <a href="http://rml.io">RML</a> and <a href="https://fno.io">FnO</a>,
                    and implemented in the <a href="https://github.com/RMLio/RML-Mapper">RMLMapper</a>.
                </p>
            </div>
        </div>
    </div>
</section>

<!-- Example Section -->
<section id="example">
    <div class="container">
        <div class="row">
            <div class="col-lg-12 text-center">
                <h2>Example</h2>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-6">
                <p>
                    As example, we generate Linked Data using a RML and FnO declarative document.
                    Resources of type <code>ex:Person</code> are created based on a data source (<code>:Person_LogicalSource</code>).
                    Each resource gets assigned a name (<code>:NameMapping</code>),
                    using the predicate <code>dbo:name</code>.
                    To get the name value, we use the function <code>grel:toTitleCase</code>,
                    to have nicely formatted names in our dataset.
                    For this, we use the <code>"name"</code> reference within our data source (<code>:Person_LogicalSource</code>).
                </p>
            </div>
            <div class="col-lg-6">
{% renderTemplate "md" %}
```turtle
:Person_TemplateMapping
    rml:logicalSource :Person_LogicalSource ;
    rr:subjectMap :Person_SubjectMap ;
    rr:predicateObjectMap :NameMapping .
:Person_SubjectMap
    rr:template "http://example.org/{id}" ;
    rr:class ex:Person .
:NameMapping
    rr:predicate dbo:name ;
    rr:objectMap [
        a fnml:FunctionTermMap ;
        fnml:functionValue [
            rml:logicalSource :Person_LogicalSource ;
            rr:predicateObjectMap [
                rr:predicate fno:executes ;
                rr:objectMap [ rr:constant grel:toTitleCase ] ] ;
            rr:predicateObjectMap [
                rr:predicate grel:valueParameter ;
                rr:objectMap [ rml:reference "name" ] ]
        ]
    ] .
```
{% endrenderTemplate %}
            </div>
        </div>
        <div class="row">
            <div class="col-lg-6">
                <p>
                    To retrieve the actual implementation of <code>grel:toTitleCase</code>,
                    we dereference <code>grel:toTitleCase</code> to get the actual implementation (<code>http://example.com/grelFunctions.jar</code>).
                </p>

                <blockquote>
                    <p>
                        More info on this dereferencing can be found in <a href="http://ceur-ws.org/Vol-1690/paper110.pdf">our accompanying paper</a>.
                    </p>
                </blockquote>
            </div>
            <div class="col-lg-6">
{% renderTemplate "md" %}
```turtle
grel:toUppercase :implementedIn :grelJavaImpl .
:grelJavaImpl a prov:Agent;
    doap:file-release <http://example.com/grelFunctions.jar> .

<http://example.com/grelFunctions.jar> spdx:File ;
spdx:checksum [
    spdx:algorithm spdx:checksumAlgorithm_sha1 ;
    spdx:checksumValue "ffbdbf69f1572ea6a9f2da9a351a480f30070312"
] .
```
{% endrenderTemplate %}
            </div>
        </div>

        <div class="row">
            <div class="col-lg-8 col-lg-offset-2">
                <p>This can thus trigger the generation of the triple <code>&lt;http://example.com/1&gt; dbo:name "Ben De Meester"</code>.</p>

                <p>The generation provenance of the value <code>"Ben De Meester"</code> can be modeled as follows:</p>

                <figure style="margin: 16px 0;">
                    <img src="../img/fno_prov_model.png" style="max-width: 100%"/>
                </figure>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-6">
                <p>The FnO statements involved in the data processing can be automatically captured during the mapping process.</p>
            </div>
            <div class="col-lg-6">
{% renderTemplate "md" %}
```turtle
grel:toTitleCase a fno:Function, prov:Entity ;
    fno:name "title case" ;
    fno:expects ( [ fno:predicate grel:stringInput ] ) ;
    fno:output ( [ fno:predicate grel:stringOutput ] ) .

:exe a fno:Execution, prov:Activity ;
    :implementation :grelJavaImpl ;
    fno:executes grel:toTitleCase ;
    grel:stringInput :input ;
    grel:stringOutput :output .

    :input a prov:Entity ; rdf:value "ben de meester" .
    :output a prov:Entity ; rdf:value "Ben De Meester" .
```
{% endrenderTemplate %}
            </div>
        </div>

        <div class="row">
            <div class="col-lg-6">
                <p>These FnO statements allow us to derive the actual PROV-O information.</p>
            </div>
            <div class="col-lg-6">
{% renderTemplate "md" %}
```turtle
:NameMapping a prov:Activity .

:exe a prov:Activity ;
    prov:wasInformedBy :NameMapping ;
    prov:used :input ;
    prov:used grel:toTitleCase ;
    prov:wasAssociatedWith :grelJavaImpl ;
    prov:qualifiedAssociation [
        a prov:Association;
        prov:agent   :grelJavaImpl;
        prov:hadRole :implementation;
        prov:hadPlan grel:toTitleCase
    ] ;
    prov:startedAtTime "XXX"^^xsd:dateTime ;
    prov:endedAtTime "YYY"^^xsd:dateTime .

:output a prov:Entity ;
    prov:wasGeneratedBy :exe ;
    prov:wasAttributedTo :grelJavaImpl .
```
{% endrenderTemplate %}
            </div>
        </div>

        <div class="row">
            <div class="col-lg-8 col-lg-offset-2">
                <p>As a result, we have:</p>

                <ul>
                    <li>The output entities, i.e., the resulting value, give a clear list of output values.</li>
                    <li>The data transformation activities, i.e., the FnO execution triples, show implementation-independent what happened.<br/>
                        This can be used to compare results with other implementations.</li>
                    <li>The tool agents, i.e., the actual implementation files (or remote APIs, or other ways of performing the actual function…),
                        show exactly which implementation was responsible for the execution. This allows attribution/accountability.</li>
                </ul>

                <p>This has the added benefits that:</p>

                <ul>
                    <li>
                        Easy queries (e.g., querying all <code>fno:Execution</code> that <code>fno:executes grel:toUppercase</code>, that <code>prov:wasInformedBy :NameMapping</code>)
                        can give an immedia ground truth
                    </li>
                    <li>
                        To compare data transformation tools, the actual mapping no longer needs to be executed,
                        only the <code>:input</code> values are needed.
                    </li>
                    <li>
                        The <code>prov:startedAtTime</code> and <code>prov:endedAtTime</code> allow for easy performance evaluation.
                    </li>
                </ul>
            </div>
        </div>

        <div>
            <p>
                More information can be found in the paper:
                <a href="http://ceur-ws.org/Vol-1931/paper-05.pdf" target="_blank">Detailed Provenance Capture of Data Processing</a>
            </p>
        </div>
    </div>
</section>

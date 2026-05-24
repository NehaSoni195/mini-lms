import { View, StyleSheet, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";

export default function CourseWebView() {
  const { course, instructor } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);

  const courseData = course ? JSON.parse(course) : {};
  const instructorData = instructor ? JSON.parse(instructor) : {};

  const htmlContent = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Course Viewer</title>

      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial;
          margin: 0;
          background: #f4f6f8;
          color: #111;
        }

        /* HERO SECTION */
        .hero {
          background: linear-gradient(135deg, #111, #2a2a2a);
          padding: 28px 20px;
          color: #fff;
          border-bottom-left-radius: 28px;
          border-bottom-right-radius: 28px;
        }

        .title {
          font-size: 24px;
          font-weight: 800;
          line-height: 32px;
        }

        .sub {
          margin-top: 8px;
          font-size: 14px;
          opacity: 0.85;
        }

        .badge {
          display: inline-block;
          margin-top: 14px;
          padding: 6px 14px;
          background: #fff;
          color: #111;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
        }

        /* CONTAINER */
        .container {
          padding: 16px;
        }

        .card {
          background: #fff;
          border-radius: 22px;
          padding: 18px;
          margin-top: -18px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.06);
        }

        /* PROGRESS */
        .progressBox {
          margin-top: 10px;
        }

        .progressText {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #666;
        }

        .bar {
          height: 10px;
          background: #eee;
          border-radius: 20px;
          overflow: hidden;
          margin-top: 6px;
        }

        .fill {
          width: 65%;
          height: 100%;
          background: #111;
          border-radius: 20px;
        }

        /* SECTION */
        .section {
          margin-top: 18px;
          padding: 16px;
          background: #fafafa;
          border-radius: 16px;
          border: 1px solid #eee;
        }

        .section h3 {
          margin: 0 0 10px;
          font-size: 15px;
        }

        .text {
          font-size: 14px;
          color: #555;
          line-height: 24px;
        }

        ul {
          margin: 0;
          padding-left: 18px;
        }

        li {
          margin-bottom: 8px;
          font-size: 14px;
          color: #444;
        }

        /* GRID */
        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 10px;
        }

        .miniCard {
          background: white;
          border-radius: 14px;
          padding: 14px;
          border: 1px solid #eee;
        }

        .miniTitle {
          font-size: 13px;
          font-weight: 700;
        }

        .miniDesc {
          font-size: 12px;
          color: #666;
          margin-top: 4px;
        }

      </style>

      <script>
        function updateContent(data) {
          document.getElementById("title").innerText =
            data.title || "Course";

          document.getElementById("instructor").innerText =
            data.instructor || "Instructor";

          document.getElementById("desc").innerText =
            data.description || "No description available";

          document.getElementById("courseId").innerText =
            "Course ID: " + (data.courseId || "N/A");
        }
      </script>
    </head>

    <body>

      <!-- HERO -->
      <div class="hero">
        <div class="title" id="title">Loading...</div>

        <div class="sub" id="instructor"></div>

        <div class="badge">🔥 Premium LMS Course</div>
      </div>

      <div class="container">

        <div class="card">

          <!-- PROGRESS -->
          <div class="progressBox">
            <div class="progressText">
              <span id="courseId"></span>
              <span>Progress: 65%</span>
            </div>

            <div class="bar">
              <div class="fill"></div>
            </div>
          </div>

          <!-- ABOUT -->
          <div class="section">
            <h3>📘 About This Course</h3>

            <div class="text" id="desc"></div>
          </div>

          <!-- LEARNING -->
          <div class="section">
            <h3>🎯 What You Will Learn</h3>

            <ul>
              <li>Build modern mobile applications</li>
              <li>Master React Native fundamentals</li>
              <li>Create scalable UI architecture</li>
              <li>Implement API integration</li>
              <li>Authentication & navigation systems</li>
            </ul>
          </div>

          <!-- MODULES -->
          <div class="section">
            <h3>📚 Course Modules</h3>

            <div class="grid">

              <div class="miniCard">
                <div class="miniTitle">Module 1</div>
                <div class="miniDesc">Introduction</div>
              </div>

              <div class="miniCard">
                <div class="miniTitle">Module 2</div>
                <div class="miniDesc">Setup & Tools</div>
              </div>

              <div class="miniCard">
                <div class="miniTitle">Module 3</div>
                <div class="miniDesc">Core Concepts</div>
              </div>

              <div class="miniCard">
                <div class="miniTitle">Module 4</div>
                <div class="miniDesc">Final Project</div>
              </div>

            </div>
          </div>

          <!-- EXTRA -->
          <div class="section">
            <h3>⭐ Why This Course?</h3>

            <ul>
              <li>Industry-level app architecture</li>
              <li>Project-based learning experience</li>
              <li>Clean and scalable coding practices</li>
              <li>Modern mobile app UI implementation</li>
            </ul>
          </div>

        </div>
      </div>

    </body>
  </html>
  `;

  const injectedJS = `
    updateContent({
      title: ${JSON.stringify(courseData.title)},
      description: ${JSON.stringify(courseData.description)},
      instructor: ${JSON.stringify(
        instructorData?.name?.first + " " + instructorData?.name?.last,
      )},
      courseId: ${JSON.stringify(courseData.id)}
    });
    true;
  `;

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#111" />
        </View>
      )}

      <WebView
        source={{ html: htmlContent }}
        injectedJavaScript={injectedJS}
        onLoadEnd={() => setLoading(false)}
        startInLoadingState={true}
        style={{ backgroundColor: "#f4f6f8" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
  },

  loader: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f6f8",
    zIndex: 10,
  },
});
